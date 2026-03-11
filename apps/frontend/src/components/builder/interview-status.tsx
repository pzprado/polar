"use client";

import { motion } from "motion/react";

export function InterviewStatus() {
  return (
    <div className="flex items-start">
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
        className="flex items-center gap-2 rounded-lg bg-[#2563EB]/[0.06] px-3 py-2.5"
      >
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-[#2563EB]/40"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
        <span className="text-sm text-[#57534E]">Thinking about your project...</span>
      </motion.div>
    </div>
  );
}
