"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-[#5c6370]">{language === "frontend" ? "Frontend" : "Smart contract"} code will appear here</p>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-0">
      <button
        className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded text-[#8b919e] transition-colors hover:text-white"
        onClick={copyToClipboard}
        aria-label="Copy code"
        type="button"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <ScrollArea className="h-full min-h-0">
        <pre className="whitespace-pre-wrap p-4 pr-12 font-mono text-xs leading-relaxed text-[#b8bcc6]">{code}</pre>
      </ScrollArea>
    </div>
  );
}
