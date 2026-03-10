"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
      <Card className="border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-700">Deployment Failed</p>
        <p className="mt-1 text-xs text-red-600">{result.error}</p>
      </Card>
    );
  }

  return (
    <Card className="space-y-3 p-4">
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Live on Fuji</Badge>

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

      <Separator />

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

      <p className="text-xs text-gray-400">Enable Kite AI payments — coming soon</p>
    </Card>
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
      <p className="mb-1 text-xs text-gray-500">{label}</p>
      <div className="flex items-center gap-2">
        <code className="flex-1 truncate rounded bg-gray-100 px-2 py-1 font-mono text-xs">{value}</code>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onCopy} aria-label={`Copy ${label}`}>
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
    </div>
  );
}
