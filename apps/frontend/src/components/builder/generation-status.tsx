"use client";

import { Loader2 } from "lucide-react";

export function GenerationStatus() {
  return (
    <div className="flex items-start gap-2">
      <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-600">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Generating your app...</span>
      </div>
    </div>
  );
}
