"use client";

import { SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";
import { Skeleton } from "@/components/ui/skeleton";
import { polarSandpackTheme, sandpackCustomSetup } from "@/lib/preview/sandpack-config";
import { getSandpackFiles } from "@/lib/preview/template-files";

interface PreviewPanelProps {
  frontendCode: string | null;
  contractAddress?: string;
}

export function PreviewPanel({ frontendCode, contractAddress }: PreviewPanelProps) {
  if (!frontendCode) {
    return (
      <div className="flex h-full min-h-[480px] flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
        <Skeleton className="mb-4 h-8 w-8 rounded-full" />
        <p className="text-sm text-gray-500">Your app preview will appear here</p>
        <p className="mt-1 text-xs text-gray-400">Describe what you want to build</p>
      </div>
    );
  }

  const files = getSandpackFiles(frontendCode, contractAddress);

  return (
    <div className="h-full min-h-[480px] overflow-hidden rounded-xl border border-gray-200">
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
