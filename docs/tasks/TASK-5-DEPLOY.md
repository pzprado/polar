# Task 5: Deploy System

**Priority**: Can run in parallel after Task 0 completes
**Estimated time**: ~25 minutes
**Dependencies**: Task 0 (types, constants), Task 2 (compiler.ts, deployer.ts — for the API route)
**Parallel with**: Tasks 1, 3, 4
**Note**: The UI components (deploy button, deploy result) can be built independently. The API route imports from Task 2.

## Objective

Build the deployment system: an API route that compiles Solidity and deploys to Fuji, plus UI components for the deploy button and result display.

## Files to Create

| File | Purpose |
|------|---------|
| `src/app/api/deploy/route.ts` | POST endpoint: compile + deploy to Fuji |
| `src/components/builder/deploy-button.tsx` | "Deploy to Avalanche" button with states |
| `src/components/builder/deploy-result.tsx` | Shows contract address, tx hash, explorer link |
| `src/hooks/use-deploy.ts` | Hook managing deploy state and API calls |

## API Route (`src/app/api/deploy/route.ts`)

**CRITICAL**: Must use `export const runtime = 'nodejs'` — solc-js needs Node.js, not Edge runtime.

```typescript
import { NextRequest, NextResponse } from "next/server";
import { DeployRequest, DeployResult } from "@/lib/types";
import { compileContract } from "@/lib/contracts/compiler";
import { deployContract } from "@/lib/contracts/deployer";

// solc-js requires Node.js runtime (WASM)
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body: DeployRequest = await request.json();

    if (!body.contractSource || !body.contractName) {
      return NextResponse.json(
        { success: false, error: "Contract source and name are required" },
        { status: 400 }
      );
    }

    // Step 1: Compile
    const compileResult = compileContract(body.contractSource, body.contractName);

    if (!compileResult.success || !compileResult.abi || !compileResult.bytecode) {
      return NextResponse.json(
        {
          success: false,
          error: `Compilation failed: ${compileResult.errors?.join(", ") || "Unknown error"}`,
        },
        { status: 400 }
      );
    }

    // Step 2: Deploy to Fuji
    const deployResult = await deployContract(
      compileResult.abi,
      compileResult.bytecode,
      [] // No constructor args for current templates
    );

    return NextResponse.json(deployResult);
  } catch (error: any) {
    console.error("Deploy error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Deployment failed" },
      { status: 500 }
    );
  }
}
```

## Deploy Hook (`src/hooks/use-deploy.ts`)

```typescript
"use client";

import { useState } from "react";
import { DeployResult } from "@/lib/types";

interface UseDeployReturn {
  deploying: boolean;
  result: DeployResult | null;
  error: string | null;
  deploy: (contractSource: string, contractName: string) => Promise<DeployResult | null>;
  reset: () => void;
}

export function useDeploy(): UseDeployReturn {
  const [deploying, setDeploying] = useState(false);
  const [result, setResult] = useState<DeployResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const deploy = async (contractSource: string, contractName: string): Promise<DeployResult | null> => {
    setDeploying(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractSource, contractName }),
      });

      const data: DeployResult = await response.json();

      if (!data.success) {
        setError(data.error || "Deployment failed");
        setResult(data);
        return data;
      }

      setResult(data);
      return data;
    } catch (err: any) {
      const errorMsg = err.message || "Network error during deployment";
      setError(errorMsg);
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
```

## Deploy Button (`src/components/builder/deploy-button.tsx`)

```typescript
"use client";

import { Button } from "@/components/ui/button";
import { Rocket, Loader2, Check, AlertCircle } from "lucide-react";

interface DeployButtonProps {
  onDeploy: () => void;
  deploying: boolean;
  deployed: boolean;
  disabled: boolean;        // Disabled when no code generated yet
  error?: string | null;
}

export function DeployButton({ onDeploy, deploying, deployed, disabled, error }: DeployButtonProps) {
  // Button states:
  // 1. Disabled (no code yet)
  // 2. Ready to deploy
  // 3. Deploying (loading spinner)
  // 4. Deployed (success)
  // 5. Error

  if (deployed) {
    return (
      <Button
        disabled
        className="bg-green-600 hover:bg-green-600 text-white"
      >
        <Check className="mr-2 h-4 w-4" />
        Deployed
      </Button>
    );
  }

  if (error) {
    return (
      <Button
        onClick={onDeploy}
        variant="destructive"
        className="gap-2"
      >
        <AlertCircle className="h-4 w-4" />
        Retry Deploy
      </Button>
    );
  }

  return (
    <Button
      onClick={onDeploy}
      disabled={disabled || deploying}
      className="bg-[#E84142] hover:bg-[#d13a3b] text-white gap-2"
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
    </Button>
  );
}
```

**Design notes**:
- Avalanche red (`#E84142`) background for the primary state
- Green for success state
- Loading spinner during deployment
- Destructive/red variant for retry after error
- Always shows an icon + text

## Deploy Result (`src/components/builder/deploy-result.tsx`)

```typescript
"use client";

import { useState } from "react";
import { DeployResult } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Check, ExternalLink } from "lucide-react";

interface DeployResultPanelProps {
  result: DeployResult;
}

export function DeployResultPanel({ result }: DeployResultPanelProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyText = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!result.success) {
    return (
      <Card className="p-4 border-red-200 bg-red-50">
        <p className="text-sm text-red-700 font-medium">Deployment Failed</p>
        <p className="text-xs text-red-600 mt-1">{result.error}</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          Live on Fuji
        </Badge>
      </div>

      {result.contractAddress && (
        <div>
          <p className="text-xs text-gray-500 mb-1">Contract Address</p>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono flex-1 truncate">
              {result.contractAddress}
            </code>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 shrink-0"
              onClick={() => copyText(result.contractAddress!, "address")}
            >
              {copied === "address" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      )}

      {result.transactionHash && (
        <div>
          <p className="text-xs text-gray-500 mb-1">Transaction Hash</p>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono flex-1 truncate">
              {result.transactionHash}
            </code>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 shrink-0"
              onClick={() => copyText(result.transactionHash!, "tx")}
            >
              {copied === "tx" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      )}

      <Separator />

      {result.explorerUrl && (
        <a
          href={result.explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-[#E84142] hover:underline"
        >
          View on Snowtrace <ExternalLink className="h-3 w-3" />
        </a>
      )}

      <p className="text-xs text-gray-400 mt-2">
        Enable Kite AI payments — coming soon
      </p>
    </Card>
  );
}
```

**Design notes**:
- Success: green badge "Live on Fuji", contract address + tx hash with copy buttons
- Error: red card with error message
- Explorer link in Avalanche red
- Kite branding teaser at the bottom
- Addresses and hashes are truncated with `truncate` class and shown in monospace

## Integration with Builder Page (Task 6)

The builder page will use these components like:

```tsx
const { deploying, result, error, deploy } = useDeploy();

<DeployButton
  onDeploy={() => deploy(generation.contractSource, generation.contractName)}
  deploying={deploying}
  deployed={result?.success ?? false}
  disabled={!generation}
  error={error}
/>

{result && <DeployResultPanel result={result} />}
```

## Verification

1. Deploy button renders in all states (disabled, ready, deploying, deployed, error)
2. Deploy result shows contract address, tx hash, explorer link
3. Copy buttons work
4. Explorer link opens in new tab
5. API route compiles and deploys (requires DEPLOYER_PRIVATE_KEY in .env.local and Fuji AVAX)
6. API route returns proper error messages for compilation failures
7. No TypeScript errors

## Testing Without a Fuji Wallet

If you don't have a funded Fuji wallet:
- The deploy button and result components can be tested with mock data
- The API route will return `{ success: false, error: "Deployer private key not configured" }`
- To get a Fuji wallet: generate a new one with ethers.js, fund it at https://faucet.avax.network/
