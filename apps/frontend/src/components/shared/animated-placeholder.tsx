"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

const STATIC_PREFIX = "Ask Polar to build ";

const ROTATING_OPTIONS = [
  "a rewards program",
  "a fan membership",
  "a coin flip game",
  "a tipping page",
  "a voting app",
  "a loyalty system",
];

const TYPE_SPEED = 45; // ms per character
const PAUSE_BEFORE_ROTATE = 600;
const ROTATE_INTERVAL = 2400;

export function AnimatedPlaceholder({ visible }: { visible: boolean }) {
  const [typedPrefix, setTypedPrefix] = useState("");
  const [prefixDone, setPrefixDone] = useState(false);
  const [activeOption, setActiveOption] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Type out prefix character by character
  useEffect(() => {
    if (!visible) return;

    let i = 0;
    const typeNext = () => {
      if (i < STATIC_PREFIX.length) {
        i++;
        setTypedPrefix(STATIC_PREFIX.slice(0, i));
        timerRef.current = setTimeout(typeNext, TYPE_SPEED);
      } else {
        timerRef.current = setTimeout(() => setPrefixDone(true), PAUSE_BEFORE_ROTATE);
      }
    };

    timerRef.current = setTimeout(typeNext, 400); // small delay before starting

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible]);

  // Rotate options once prefix is typed
  useEffect(() => {
    if (!prefixDone || !visible) return;

    const interval = setInterval(() => {
      setActiveOption((prev) => (prev + 1) % ROTATING_OPTIONS.length);
    }, ROTATE_INTERVAL);

    return () => clearInterval(interval);
  }, [prefixDone, visible]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-0 px-2 py-2 text-lg font-light">
      <span className="text-[#5c6370]">{typedPrefix}</span>
      {typedPrefix.length < STATIC_PREFIX.length && (
        <span className="inline-block w-px h-5 align-middle bg-[#5c6370] animate-pulse" />
      )}
      {prefixDone && (
        <AnimatePresence mode="wait">
          <motion.span
            key={activeOption}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="relative inline-block"
          >
            <span
              className="text-[#E84142]/60"
              style={{ textShadow: "0 0 12px rgba(232, 65, 66, 0.4)" }}
            >
              {ROTATING_OPTIONS[activeOption]}
            </span>
          </motion.span>
        </AnimatePresence>
      )}
    </div>
  );
}
