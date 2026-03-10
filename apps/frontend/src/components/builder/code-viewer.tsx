"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CodeViewerProps {
  frontendCode: string | null;
  contractSource: string | null;
}

export function CodeViewer({ frontendCode, contractSource }: CodeViewerProps) {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const copyToClipboard = async (code: string, tab: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <Tabs defaultValue="frontend" className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
        <TabsList className="h-8">
          <TabsTrigger value="frontend" className="text-xs">
            Frontend
          </TabsTrigger>
          <TabsTrigger value="contract" className="text-xs">
            Contract
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="frontend" className="m-0 min-h-0 flex-1">
        {frontendCode ? (
          <CodePanel
            code={frontendCode}
            copied={copiedTab === "frontend"}
            onCopy={() => copyToClipboard(frontendCode, "frontend")}
          />
        ) : (
          <CodePlaceholder label="Frontend code" />
        )}
      </TabsContent>

      <TabsContent value="contract" className="m-0 min-h-0 flex-1">
        {contractSource ? (
          <CodePanel
            code={contractSource}
            copied={copiedTab === "contract"}
            onCopy={() => copyToClipboard(contractSource, "contract")}
          />
        ) : (
          <CodePlaceholder label="Smart contract" />
        )}
      </TabsContent>
    </Tabs>
  );
}

function CodePanel({ code, copied, onCopy }: { code: string; copied: boolean; onCopy: () => void }) {
  return (
    <div className="relative h-full min-h-0">
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 top-2 z-10 h-7 w-7 p-0"
        onClick={onCopy}
        aria-label="Copy code"
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </Button>
      <ScrollArea className="h-full min-h-0">
        <pre className="whitespace-pre-wrap p-4 pr-10 font-mono text-xs leading-relaxed text-gray-700">{code}</pre>
      </ScrollArea>
    </div>
  );
}

function CodePlaceholder({ label }: { label: string }) {
  return <div className="flex h-full items-center justify-center px-4 text-center text-sm text-gray-300">{label} will appear here</div>;
}
