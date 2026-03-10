"use client";

import { useEffect, useRef } from "react";

interface Flake {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  landed: boolean;
}

const MAX_ACTIVE = 35;
const SPAWN_INTERVAL = 350;
const STACK_COLS = 120; // resolution of the snow height map

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
    // Snow height map — tracks accumulated snow depth across the panel surface
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
        landed: false,
      });
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

      const activeCount = flakes.filter((f) => !f.landed).length;
      if (time - lastSpawn > SPAWN_INTERVAL && activeCount < MAX_ACTIVE) {
        spawn(w);
        lastSpawn = time;
      }

      for (let i = flakes.length - 1; i >= 0; i--) {
        const f = flakes[i];

        if (f.landed) {
          drawSnowflake(ctx, f.x, f.y, f.size, f.rotation, f.opacity);
          continue;
        }

        // Physics
        f.vy += 0.002;
        f.vx += Math.sin(time * 0.0008 + i * 1.7) * 0.004;
        f.x += f.vx;
        f.y += f.vy;
        f.rotation += f.rotationSpeed;

        // Collision with prompt panel surface (including stacked snow)
        if (surface && f.x >= surface.left && f.x <= surface.right) {
          const col = Math.floor(((f.x - surface.left) / surface.width) * STACK_COLS);
          const colIdx = Math.max(0, Math.min(STACK_COLS - 1, col));
          const landingY = surface.top - snowHeight[colIdx];

          if (f.y + f.size >= landingY) {
            f.landed = true;
            f.y = landingY - f.size;
            f.vy = 0;
            f.vx = 0;
            f.rotationSpeed = 0;
            f.opacity = 0.5;
            // Add to snow height for stacking
            snowHeight[colIdx] += f.size * 0.8;
            // Spread snow to adjacent columns for natural look
            if (colIdx > 0) snowHeight[colIdx - 1] += f.size * 0.3;
            if (colIdx < STACK_COLS - 1) snowHeight[colIdx + 1] += f.size * 0.3;
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
