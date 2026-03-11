import type { SandpackTheme } from "@codesandbox/sandpack-react";

export const polarSandpackTheme: SandpackTheme = {
  colors: {
    surface1: "#ffffff",
    surface2: "#f8f9fa",
    surface3: "#f1f3f5",
    clickable: "#6b7280",
    base: "#1f2937",
    disabled: "#9ca3af",
    hover: "#E84142",
    accent: "#E84142",
    error: "#ef4444",
    errorSurface: "#fef2f2",
  },
  syntax: {
    plain: "#1f2937",
    comment: { color: "#9ca3af", fontStyle: "italic" },
    keyword: "#8b5cf6",
    tag: "#E84142",
    punctuation: "#6b7280",
    definition: "#2563eb",
    property: "#d97706",
    static: "#059669",
    string: "#059669",
  },
  font: {
    body: '"Inter", "Segoe UI", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", Menlo, monospace',
    size: "13px",
    lineHeight: "1.6",
  },
};

export const sandpackDependencies: Record<string, string> = {
  wagmi: "^2.14.0",
  viem: "^2.21.0",
  "@tanstack/react-query": "^5.62.0",
};

export const sandpackCustomSetup = {
  dependencies: sandpackDependencies,
};
