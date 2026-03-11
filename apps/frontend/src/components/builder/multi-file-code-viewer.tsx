"use client";

import { useState } from "react";
import { GeneratedFile } from "@/lib/types";
import { CodeViewer } from "./code-viewer";

interface MultiFileCodeViewerProps {
  files: GeneratedFile[] | null;
}

export function MultiFileCodeViewer({ files }: MultiFileCodeViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!files || files.length === 0) {
    return <CodeViewer code={null} language="frontend" />;
  }

  // Single file — just render CodeViewer directly
  if (files.length === 1) {
    return <CodeViewer code={files[0].content} language="frontend" />;
  }

  const activeFile = files[activeIndex] || files[0];

  return (
    <div className="flex h-full flex-col">
      {/* File tabs */}
      <div className="flex shrink-0 gap-0.5 overflow-x-auto border-b border-black/[0.06] px-2 pt-1">
        {files.map((file, index) => {
          const isActive = index === activeIndex;
          const fileName = file.path.split("/").pop() || file.path;
          return (
            <button
              key={file.path}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`shrink-0 rounded-t-md px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "border-b-2 border-[#2563EB] bg-[#2563EB]/5 text-[#2563EB]"
                  : "text-[#A8A29E] hover:text-[#78716C]"
              }`}
              title={file.path}
            >
              {fileName}
            </button>
          );
        })}
      </div>

      {/* File content */}
      <div className="min-h-0 flex-1">
        <CodeViewer code={activeFile.content} language="frontend" />
      </div>
    </div>
  );
}
