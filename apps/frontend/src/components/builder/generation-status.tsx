"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

const THINKING_STEPS = [
  "Understanding your request...",
  "Selecting contract template...",
  "Configuring smart contract parameters...",
  "Generating frontend code...",
  "Wiring contract interactions...",
  "Finalizing your app...",
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
        {THINKING_STEPS.map((step, index) => {
          if (index > currentStep) return null;

          const isActive = index === currentStep;
          const isDone = index < currentStep;

          return (
            <div
              key={step}
              className={`flex items-center gap-2 text-sm transition-opacity duration-300 ${
                isActive ? "text-[#b8bcc6]" : "text-[#5c6370]"
              }`}
            >
              {isDone ? (
                <Check className="h-3 w-3 shrink-0 text-green-400" />
              ) : (
                <Loader2 className="h-3 w-3 shrink-0 animate-spin text-[#E84142]" />
              )}
              <span>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
