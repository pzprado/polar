"use client";

import { useEffect, useRef } from "react";

type FlakeState = "floating" | "settling" | "resting";

interface Flake {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  state: FlakeState;
  settleTimer: number;
}

const MAX_ACTIVE = 35;
const SPAWN_INTERVAL = 350;
const STACK_COLS = 120;
const SETTLE_FRAMES = 100; // frames to fully come to rest
const EDGE_MARGIN = 18; // pixels from panel edge to trigger roll-off
const NUDGE_RADIUS = 12; // pixels — impact radius for disturbing neighbors
const FRICTION = 0.96;

function drawSnowflake(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  opacity: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = size > 3 ? 1 : 0.7;
  ctx.lineCap = "round";

  const arms = 6;
  const armLen = size;
  const branchLen = armLen * 0.35;
  const branchAngle = Math.PI / 5;

  for (let i = 0; i < arms; i++) {
    const angle = (Math.PI * 2 * i) / arms;
    const ax = Math.cos(angle) * armLen;
    const ay = Math.sin(angle) * armLen;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(ax, ay);
    ctx.stroke();

    const bx = Math.cos(angle) * armLen * 0.6;
    const by = Math.sin(angle) * armLen * 0.6;

    for (const sign of [-1, 1]) {
      const ba = angle + branchAngle * sign;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + Math.cos(ba) * branchLen, by + Math.sin(ba) * branchLen);
      ctx.stroke();
    }
  }

  ctx.restore();
}

export function Snowfall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const flakes: Flake[] = [];
    const snowHeight = new Float32Array(STACK_COLS);
    let animationId: number;
    let lastSpawn = 0;
    let disposed = false;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const getSurface = (): { top: number; left: number; right: number; width: number } | null => {
      const parent = canvas.parentElement;
      if (!parent) return null;
      const panel = parent.querySelector(".glass-panel");
      if (!panel) return null;
      const parentRect = parent.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      return {
        top: panelRect.top - parentRect.top,
        left: panelRect.left - parentRect.left,
        right: panelRect.right - parentRect.left,
        width: panelRect.width,
      };
    };

    const spawn = (w: number) => {
      flakes.push({
        x: Math.random() * w,
        y: -10,
        size: 1.5 + Math.random() * 2.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: 0.3 + Math.random() * 0.5,
        opacity: 0.3 + Math.random() * 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.008,
        state: "floating",
        settleTimer: 0,
      });
    };

    // Nudge nearby resting flakes when a new one lands
    const nudgeNeighbors = (x: number, y: number) => {
      for (const f of flakes) {
        if (f.state !== "resting") continue;
        const dx = f.x - x;
        const dy = f.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < NUDGE_RADIUS && dist > 0) {
          const strength = (1 - dist / NUDGE_RADIUS) * 0.15;
          f.vx += (dx / dist) * strength;
          f.vy += (dy / dist) * strength * 0.3;
          f.state = "settling";
          f.settleTimer = SETTLE_FRAMES * 0.6; // partially settled already
        }
      }
    };

    const tick = (time: number) => {
      if (disposed) return;

      const parent = canvas.parentElement;
      if (!parent) {
        animationId = requestAnimationFrame(tick);
        return;
      }

      const w = parent.clientWidth;
      const h = parent.clientHeight;
      const surface = getSurface();

      ctx.clearRect(0, 0, w, h);

      const activeCount = flakes.filter((f) => f.state === "floating").length;
      if (time - lastSpawn > SPAWN_INTERVAL && activeCount < MAX_ACTIVE) {
        spawn(w);
        lastSpawn = time;
      }

      for (let i = flakes.length - 1; i >= 0; i--) {
        const f = flakes[i];

        // ── Resting: fully stopped ──
        if (f.state === "resting") {
          drawSnowflake(ctx, f.x, f.y, f.size, f.rotation, f.opacity);
          continue;
        }

        // ── Settling: decelerating with friction ──
        if (f.state === "settling") {
          f.vx *= FRICTION;
          f.vy *= FRICTION;
          f.x += f.vx;
          f.y += f.vy;
          f.rotation += f.rotationSpeed * (1 - f.settleTimer / SETTLE_FRAMES);
          f.settleTimer++;

          // Keep on surface — don't sink below
          if (surface && f.x >= surface.left && f.x <= surface.right) {
            const col = Math.floor(((f.x - surface.left) / surface.width) * STACK_COLS);
            const colIdx = Math.max(0, Math.min(STACK_COLS - 1, col));
            const floorY = surface.top - snowHeight[colIdx] - f.size;
            if (f.y > floorY) f.y = floorY;
          }

          // Settled: if a settling flake drifts off the panel edge, let it fall
          if (surface && (f.x < surface.left - 5 || f.x > surface.right + 5)) {
            f.state = "floating";
            f.vy = 0.3;
            f.settleTimer = 0;
            continue;
          }

          if (f.settleTimer >= SETTLE_FRAMES || (Math.abs(f.vx) < 0.01 && Math.abs(f.vy) < 0.01)) {
            f.state = "resting";
            f.vx = 0;
            f.vy = 0;
            f.rotationSpeed = 0;
          }

          drawSnowflake(ctx, f.x, f.y, f.size, f.rotation, f.opacity);
          continue;
        }

        // ── Floating: falling with physics ──
        f.vy += 0.002;
        f.vx += Math.sin(time * 0.0008 + i * 1.7) * 0.004;
        f.x += f.vx;
        f.y += f.vy;
        f.rotation += f.rotationSpeed;

        // Collision with panel surface
        if (surface && f.x >= surface.left - 5 && f.x <= surface.right + 5) {
          const col = Math.floor(((f.x - surface.left) / surface.width) * STACK_COLS);
          const colIdx = Math.max(0, Math.min(STACK_COLS - 1, col));
          const landingY = surface.top - snowHeight[colIdx];

          if (f.y + f.size >= landingY) {
            // Edge roll-off: near edges, nudge gently outward and keep falling
            const distFromLeft = f.x - surface.left;
            const distFromRight = surface.right - f.x;

            if (distFromLeft < EDGE_MARGIN) {
              f.vx -= 0.06; // gentle drift left
              f.vy *= 0.7; // slow the fall slightly
              continue;
            }
            if (distFromRight < EDGE_MARGIN) {
              f.vx += 0.06; // gentle drift right
              f.vy *= 0.7;
              continue;
            }

            // Land and begin settling
            f.state = "settling";
            f.y = landingY - f.size;
            f.vy = 0;
            f.vx = (Math.random() - 0.5) * 0.1; // very slight lateral drift
            f.opacity = 0.5;
            f.settleTimer = 0;

            // Build up snow height
            snowHeight[colIdx] += f.size * 0.7;
            if (colIdx > 0) snowHeight[colIdx - 1] += f.size * 0.2;
            if (colIdx < STACK_COLS - 1) snowHeight[colIdx + 1] += f.size * 0.2;

            // Disturb neighbors
            nudgeNeighbors(f.x, f.y);

            drawSnowflake(ctx, f.x, f.y, f.size, f.rotation, f.opacity);
            continue;
          }
        }

        // Remove if off-screen
        if (f.y > h + 15 || f.x < -15 || f.x > w + 15) {
          flakes.splice(i, 1);
          continue;
        }

        drawSnowflake(ctx, f.x, f.y, f.size, f.rotation, f.opacity);
      }

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[15]"
      aria-hidden="true"
    />
  );
}
