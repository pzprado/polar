import { GeneratedFile } from "@/lib/types";

export function getSandpackFiles(
  frontendFiles: GeneratedFile[],
  contractAddress?: string,
): Record<string, string> {
  const files: Record<string, string> = {
    "/index.js": getEntryFile(),
    "/index.html": getHtmlFile(),
    "/setup.js": getSetupFile(contractAddress),
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
import * as ethers from "ethers";
import "./setup";
import App from "./App";

if (typeof window !== "undefined") {
  window.ethers = ethers;
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
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
