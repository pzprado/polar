"use client";

import { SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";
import { polarSandpackTheme, sandpackCustomSetup } from "@/lib/preview/sandpack-config";
import { getSandpackFiles } from "@/lib/preview/template-files";
import { motion } from "motion/react";
import { Snowflake } from "lucide-react";

interface PreviewPanelProps {
  frontendCode: string | null;
  contractAddress?: string;
}

export function PreviewPanel({ frontendCode, contractAddress }: PreviewPanelProps) {
  if (!frontendCode) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="relative mb-4"
        >
          <div className="absolute inset-0 -m-6 rounded-full bg-[#E84142]/[0.06] blur-xl" />
          <Snowflake className="relative h-8 w-8 text-[#E84142]/50" strokeWidth={1.5} />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="text-sm font-medium text-white"
        >
          Your app starts here
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
          className="mt-1 text-xs text-[#5c6370]"
        >
          Tell me what to build and I'll make it happen
        </motion.p>
      </div>
    );
  }

  const files = getSandpackFiles(frontendCode, contractAddress);

  return (
    <div className="h-full overflow-hidden rounded-lg border border-white/10 [&_.sp-wrapper]:!h-full [&_.sp-layout]:!h-full [&_.sp-preview-container]:!h-full [&_.sp-preview-iframe]:!h-full">
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
        <SandpackPreview
          style={{ height: "100%", minHeight: 0 }}
          showOpenInCodeSandbox={false}
          showRefreshButton
        />
      </SandpackProvider>
    </div>
  );
}
