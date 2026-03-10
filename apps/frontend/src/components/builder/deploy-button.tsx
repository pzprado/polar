"use client";

import { AlertCircle, Check, Loader2, Rocket, PartyPopper } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DeployButtonProps {
  onDeploy: () => void;
  deploying: boolean;
  deployed: boolean;
  disabled: boolean;
  error?: string | null;
}

export function DeployButton({ onDeploy, deploying, deployed, disabled, error }: DeployButtonProps) {
  if (deployed) {
    return (
      <motion.button
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        disabled
        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white"
      >
        <PartyPopper className="h-4 w-4" />
        Your app is live!
      </motion.button>
    );
  }

  if (error) {
    return (
      <button
        onClick={onDeploy}
        className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-500/20"
      >
        <AlertCircle className="h-4 w-4" />
        Retry Deploy
      </button>
    );
  }

  return (
    <motion.button
      onClick={onDeploy}
      disabled={disabled || deploying}
      whileHover={!disabled && !deploying ? { scale: 1.03 } : undefined}
      whileTap={!disabled && !deploying ? { scale: 0.97 } : undefined}
      transition={{ duration: 0.15 }}
      className="flex items-center gap-2 rounded-lg bg-[#E84142] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <AnimatePresence mode="wait">
        {deploying ? (
          <motion.span
            key="deploying"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Publishing your app...
          </motion.span>
        ) : (
          <motion.span
            key="deploy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Rocket className="h-4 w-4" />
            Publish App
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
