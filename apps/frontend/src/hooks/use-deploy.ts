"use client";

import { useState } from "react";
import { DeployResult, GeneratedFile } from "@/lib/types";

interface DeployOptions {
  contractSource: string;
  contractName: string;
  frontendFiles?: GeneratedFile[];
  appSlug?: string;
}

interface UseDeployReturn {
  deploying: boolean;
  result: DeployResult | null;
  error: string | null;
  deploy: (options: DeployOptions) => Promise<DeployResult | null>;
  reset: () => void;
}

export function useDeploy(): UseDeployReturn {
  const [deploying, setDeploying] = useState(false);
  const [result, setResult] = useState<DeployResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const deploy = async (options: DeployOptions): Promise<DeployResult | null> => {
    setDeploying(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options),
      });

      const data: DeployResult = await response.json();
      setResult(data);

      if (!data.success) {
        setError(data.error || "Deployment failed");
      }

      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Network error during deployment";
      setError(message);
      return null;
    } finally {
      setDeploying(false);
    }
  };

  const reset = () => {
    setDeploying(false);
    setResult(null);
    setError(null);
  };

  return { deploying, result, error, deploy, reset };
}
