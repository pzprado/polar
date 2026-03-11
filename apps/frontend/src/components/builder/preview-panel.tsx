"use client";

import { SandpackPreview, SandpackProvider, SandpackFileExplorer, SandpackLayout } from "@codesandbox/sandpack-react";
import { polarSandpackTheme, sandpackCustomSetup } from "@/lib/preview/sandpack-config";
import { getSandpackFiles } from "@/lib/preview/template-files";
import { SandpackErrorReporter } from "./sandpack-error-reporter";
import { GeneratedFile } from "@/lib/types";
import { motion } from "motion/react";
import { Snowflake } from "lucide-react";
import { useMemo } from "react";

interface PreviewPanelProps {
  frontendFiles: GeneratedFile[] | null;
  contractAddress?: string;
  onError?: (error: string) => void;
}

export function PreviewPanel({ frontendFiles, contractAddress, onError }: PreviewPanelProps) {
  const files = useMemo(
    () => (frontendFiles ? getSandpackFiles(frontendFiles, contractAddress) : null),
    [frontendFiles, contractAddress],
  );

  const visibleFiles = useMemo(() => {
    if (!frontendFiles) return [];
    return frontendFiles.map((f) => f.path.replace(/\.jsx$/, ".js"));
  }, [frontendFiles]);

  if (!frontendFiles || !files) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="relative mb-4"
        >
          <div className="absolute inset-0 -m-6 rounded-full bg-[#E84142]/[0.08] blur-xl" />
          <Snowflake className="relative h-8 w-8 text-[#E84142]/50" strokeWidth={1.5} />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="text-sm font-medium text-[#1C1917]"
        >
          Your app starts here
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
          className="mt-1 text-xs text-[#A8A29E]"
        >
          Tell me what to build and I'll make it happen
        </motion.p>
      </div>
    );
  }

  const showExplorer = frontendFiles.length > 1;

  return (
    <div className="h-full overflow-hidden rounded-lg border border-black/[0.06] [&_.sp-wrapper]:!h-full [&_.sp-layout]:!h-full [&_.sp-preview-container]:!h-full [&_.sp-preview-iframe]:!h-full">
      <SandpackProvider
        template="react"
        theme={polarSandpackTheme}
        files={files}
        customSetup={sandpackCustomSetup}
        options={{
          autorun: true,
          autoReload: true,
          externalResources: [],
          visibleFiles: showExplorer ? visibleFiles : undefined,
          activeFile: "/App.js",
        }}
      >
        {showExplorer ? (
          <SandpackLayout>
            <SandpackFileExplorer style={{ height: "100%", minHeight: 0 }} />
            <SandpackPreview
              style={{ height: "100%", minHeight: 0, flex: 1 }}
              showOpenInCodeSandbox={false}
              showRefreshButton
            />
          </SandpackLayout>
        ) : (
          <SandpackPreview
            style={{ height: "100%", minHeight: 0 }}
            showOpenInCodeSandbox={false}
            showRefreshButton
          />
        )}
        {onError && <SandpackErrorReporter onError={onError} />}
      </SandpackProvider>
    </div>
  );
}
