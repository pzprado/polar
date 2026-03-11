"use client";

import { SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";
import { polarSandpackTheme, getSandpackSetup } from "@/lib/preview/sandpack-config";
import { getSandpackFiles } from "@/lib/preview/template-files";
import { SandpackErrorReporter, SandpackErrorDetail } from "./sandpack-error-reporter";
import { ContractCategory, GeneratedFile } from "@/lib/types";
import { ThemeName } from "@/lib/preview/theme-presets";
import { motion } from "motion/react";
import { Snowflake } from "lucide-react";
import { useMemo } from "react";

interface PreviewPanelProps {
  frontendFiles: GeneratedFile[] | null;
  contractAddress?: string;
  templateId?: ContractCategory;
  contractParams?: Record<string, string>;
  onError?: (error: SandpackErrorDetail) => void;
  theme?: ThemeName;
}

export function PreviewPanel({ frontendFiles, contractAddress, templateId, contractParams, onError, theme }: PreviewPanelProps) {
  const files = useMemo(
    () => (frontendFiles ? getSandpackFiles(frontendFiles, contractAddress, templateId, contractParams, theme) : null),
    [frontendFiles, contractAddress, templateId, contractParams, theme],
  );

  // Resolve dependencies dynamically based on what the AI imported
  const customSetup = useMemo(
    () => (frontendFiles ? getSandpackSetup(frontendFiles) : { dependencies: {} }),
    [frontendFiles],
  );

  // Force Sandpack to fully remount when files change — prevents stale error screens
  const sandpackKey = useMemo(() => {
    if (!frontendFiles) return "empty";
    const hash = frontendFiles.map((f) => f.path + f.content.length).join("|");
    return hash;
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

  return (
    <div className="h-full overflow-hidden rounded-lg border border-black/[0.06] [&_.sp-wrapper]:!h-full [&_.sp-layout]:!h-full [&_.sp-preview-container]:!h-full [&_.sp-preview-iframe]:!h-full">
      <SandpackProvider
        key={sandpackKey}
        template="react-ts"
        theme={polarSandpackTheme}
        files={files}
        customSetup={customSetup}
        options={{
          autorun: true,
          autoReload: true,
          externalResources: [],
          activeFile: "/App.tsx",
        }}
      >
        <SandpackPreview
          style={{ height: "100%", minHeight: 0 }}
          showOpenInCodeSandbox={false}
          showRefreshButton
        />
        {onError && <SandpackErrorReporter onError={onError} />}
      </SandpackProvider>
    </div>
  );
}
