"use client";

import { useState } from "react";
import { Check, Code, Copy, FileCode2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "motion/react";

interface CodeViewerProps {
  code: string | null;
  language?: string;
}

export function CodeViewer({ code, language = "frontend" }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!code) {
    const isFrontend = language === "frontend";
    const IconComponent = isFrontend ? Code : FileCode2;
    const iconColor = isFrontend ? "text-[#2563EB]/30" : "text-[#D97706]/30";

    return (
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <IconComponent className={`h-6 w-6 ${iconColor}`} strokeWidth={1.5} />
        <p className="text-sm text-[#A8A29E]">
          {isFrontend ? "Your React component" : "Your Solidity contract"} lands here
        </p>
        <p className="text-xs text-[#A8A29E]/60">Ready when you are</p>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-0">
      <motion.button
        className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded text-[#78716C] transition-colors hover:text-[#1C1917]"
        onClick={copyToClipboard}
        whileTap={{ scale: 0.85 }}
        transition={{ duration: 0.1 }}
        aria-label="Copy code"
        type="button"
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span
              key="check"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
            >
              <Check className="h-3.5 w-3.5 text-green-600" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Copy className="h-3.5 w-3.5" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
      <ScrollArea className="h-full min-h-0">
        <pre className="whitespace-pre-wrap p-4 pr-12 font-mono text-xs leading-relaxed text-[#57534E]">{code}</pre>
      </ScrollArea>
    </div>
  );
}
