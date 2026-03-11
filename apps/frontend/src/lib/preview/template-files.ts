import { GeneratedFile } from "@/lib/types";

export function getSandpackFiles(
  frontendFiles: GeneratedFile[],
  contractAddress?: string,
): Record<string, string> {
  const files: Record<string, string> = {
    "/index.js": getEntryFile(),
    "/index.html": getHtmlFile(),
    "/setup.js": getSetupFile(contractAddress),
    "/wagmi-config.js": getWagmiConfigFile(),
  };

  // Map AI-generated files into Sandpack — normalize .jsx to .js for Sandpack
  for (const file of frontendFiles) {
    const sandpackPath = file.path.replace(/\.jsx$/, ".js");
    files[sandpackPath] = file.content;
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

const root = createRoot(document.getElementById("root"));
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

function getHtmlFile(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Polar Preview</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #ffffff;
      color: #1f2937;
    }
    #root { min-height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>
</body>
</html>
`;
}

function getSetupFile(contractAddress?: string): string {
  return `
if (typeof window !== "undefined") {
  window.__POLAR_CONTRACT_ADDRESS__ = ${contractAddress ? `"${contractAddress}"` : "null"};
}
`;
}
