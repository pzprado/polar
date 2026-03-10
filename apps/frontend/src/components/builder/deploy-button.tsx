"use client";

import { AlertCircle, Check, Loader2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <Button disabled className="bg-green-600 text-white hover:bg-green-600">
        <Check className="mr-2 h-4 w-4" />
        Deployed
      </Button>
    );
  }

  if (error) {
    return (
      <Button onClick={onDeploy} variant="destructive" className="gap-2">
        <AlertCircle className="h-4 w-4" />
        Retry Deploy
      </Button>
    );
  }

  return (
    <Button onClick={onDeploy} disabled={disabled || deploying} className="gap-2 bg-[#E84142] text-white hover:bg-[#d13a3b]">
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
    </Button>
  );
}
