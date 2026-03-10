"use client";

import { SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";
import { polarSandpackTheme, sandpackCustomSetup } from "@/lib/preview/sandpack-config";
import { getSandpackFiles } from "@/lib/preview/template-files";

interface PreviewPanelProps {
  frontendCode: string | null;
  contractAddress?: string;
}

export function PreviewPanel({ frontendCode, contractAddress }: PreviewPanelProps) {
  if (!frontendCode) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-white/10 mb-4" />
        <p className="text-sm text-[#8b919e]">Your app preview will appear here</p>
        <p className="mt-1 text-xs text-[#5c6370]">Describe what you want to build</p>
      </div>
    );
  }

  const files = getSandpackFiles(frontendCode, contractAddress);

  return (
    <div className="h-full overflow-hidden rounded-lg border border-white/10">
      <SandpackProvider
        template="react"
        theme={polarSandpackTheme}
        files={files}
        customSetup={sandpackCustomSetup}
        options={{
          autorun: true,
          autoReload: true,
          externalResources: [],
        }}
      >
        <SandpackPreview style={{ height: "100%" }} showOpenInCodeSandbox={false} showRefreshButton />
      </SandpackProvider>
    </div>
  );
}
