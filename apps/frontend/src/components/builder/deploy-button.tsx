"use client";

import { AlertCircle, Check, Loader2, Rocket } from "lucide-react";

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
      <button disabled className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white">
        <Check className="h-4 w-4" />
        Deployed
      </button>
    );
  }

  if (error) {
    return (
      <button
        onClick={onDeploy}
        className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
      >
        <AlertCircle className="h-4 w-4" />
        Retry Deploy
      </button>
    );
  }

  return (
    <button
      onClick={onDeploy}
      disabled={disabled || deploying}
      className="flex items-center gap-2 rounded-lg bg-[#E84142] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {deploying ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Deploying...
        </>
      ) : (
        <>
          <Rocket className="h-4 w-4" />
          Deploy to Avalanche
        </>
      )}
    </button>
  );
}
