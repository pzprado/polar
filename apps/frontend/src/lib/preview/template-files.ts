import { ContractCategory, GeneratedFile } from "@/lib/types";
import { generateMockRpcSource, MOCK_CONTRACT_ADDRESS } from "./mock-rpc-generator";

export function getSandpackFiles(
  frontendFiles: GeneratedFile[],
  contractAddress?: string,
  templateId?: ContractCategory,
  contractParams?: Record<string, string>,
): Record<string, string> {
  const useMockRpc = !contractAddress && !!templateId;

  const files: Record<string, string> = {
    "/index.tsx": getEntryFile(),
    "/index.html": getHtmlFile(),
    "/setup.ts": getSetupFile(contractAddress, useMockRpc),
    "/wagmi-config.ts": useMockRpc ? getMockWagmiConfigFile() : getWagmiConfigFile(),
  };

  if (useMockRpc && templateId && contractParams) {
    files["/mock-rpc.ts"] = generateMockRpcSource(templateId, contractParams);
  }

  // Map AI-generated files into Sandpack as-is (.tsx/.ts extensions preserved)
  for (const file of frontendFiles) {
    files[file.path] = file.content;
  }

  return files;
}

function getEntryFile(): string {
  return `
import React from "react";
import { createRoot } from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./wagmi-config";
import "./setup";
import App from "./App";

const queryClient = new QueryClient();

const root = createRoot(document.getElementById("root")!);
root.render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </WagmiProvider>
);
`;
}

function getWagmiConfigFile(): string {
  return `
import { createConfig, http } from "wagmi";
import { avalancheFuji } from "wagmi/chains";

export const config = createConfig({
  chains: [avalancheFuji],
  transports: {
    [avalancheFuji.id]: http(),
  },
});
`;
}

function getMockWagmiConfigFile(): string {
  return `
import { createConfig } from "wagmi";
import { avalancheFuji } from "wagmi/chains";
import { custom } from "viem";
import { handleRequest } from "./mock-rpc";

export const config = createConfig({
  chains: [avalancheFuji],
  transports: {
    [avalancheFuji.id]: custom({ request: handleRequest }),
  },
});
`;
}

function getHtmlFile(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Polar Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            polar: { DEFAULT: '#E84142', dark: '#c7282a' },
          },
          fontFamily: {
            sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
          },
        },
      },
    };
  </script>
  <style>
    body { min-height: 100vh; }
    #root { min-height: 100vh; }
  </style>
</head>
<body class="bg-white text-gray-900 antialiased">
  <div id="root"></div>
</body>
</html>
`;
}

function getSetupFile(contractAddress?: string, useMockRpc?: boolean): string {
  const address = contractAddress
    ? `"${contractAddress}"`
    : useMockRpc
      ? `"${MOCK_CONTRACT_ADDRESS}"`
      : "null";

  return `
if (typeof window !== "undefined") {
  (window as any).__POLAR_CONTRACT_ADDRESS__ = ${address};
}
`;
}
