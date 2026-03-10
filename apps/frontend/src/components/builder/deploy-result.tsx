"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { DeployResult } from "@/lib/types";

interface DeployResultPanelProps {
  result: DeployResult;
}

export function DeployResultPanel({ result }: DeployResultPanelProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyText = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!result.success) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
        <p className="text-sm font-medium text-red-600">Deployment Failed</p>
        <p className="mt-1 text-xs text-red-600/70">{result.error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-black/[0.06] bg-black/[0.02] p-4">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-600">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
        Live on Fuji
      </span>

      {result.contractAddress && (
        <CopyField
          label="Contract Address"
          value={result.contractAddress}
          copied={copied === "address"}
          onCopy={() => copyText(result.contractAddress!, "address")}
        />
      )}

      {result.transactionHash && (
        <CopyField
          label="Transaction Hash"
          value={result.transactionHash}
          copied={copied === "tx"}
          onCopy={() => copyText(result.transactionHash!, "tx")}
        />
      )}

      <div className="border-t border-black/[0.06] pt-3">
        {result.explorerUrl && (
          <a
            href={result.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[#E84142] hover:underline"
          >
            View on Snowtrace
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      <p className="text-xs text-[#A8A29E]">Enable Kite AI payments — coming soon</p>
    </div>
  );
}

function CopyField({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div>
      <p className="mb-1 text-xs text-[#78716C]">{label}</p>
      <div className="flex items-center gap-2">
        <code className="flex-1 truncate rounded bg-black/[0.03] px-2 py-1 font-mono text-xs text-[#57534E]">{value}</code>
        <button
          className="flex h-7 w-7 items-center justify-center rounded text-[#78716C] transition-colors hover:text-[#1C1917]"
          onClick={onCopy}
          aria-label={`Copy ${label}`}
          type="button"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </button>
      </div>
    </div>
  );
}
