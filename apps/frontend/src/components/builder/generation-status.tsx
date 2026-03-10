"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const THINKING_STEPS = [
  "Reading your mind... just kidding, reading your prompt",
  "Picking the perfect smart contract template",
  "Teaching your contract some new tricks",
  "Crafting a shiny frontend",
  "Wiring everything to the blockchain",
  "Almost there... adding the finishing touches",
];

const STEP_INTERVAL = 3000;

export function GenerationStatus() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < THINKING_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, STEP_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-start">
      <div className="space-y-2 rounded-lg bg-white/5 px-3 py-2.5">
        <AnimatePresence>
          {THINKING_STEPS.map((step, index) => {
            if (index > currentStep) return null;

            const isActive = index === currentStep;
            const isDone = index < currentStep;

            return (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                className={`flex items-center gap-2 text-sm ${
                  isActive ? "text-[#b8bcc6]" : "text-[#5c6370]"
                }`}
              >
                {isDone ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                  >
                    <Check className="h-3 w-3 shrink-0 text-green-400" />
                  </motion.span>
                ) : (
                  <Loader2 className="h-3 w-3 shrink-0 animate-spin text-[#E84142]" />
                )}
                <span>{step}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
