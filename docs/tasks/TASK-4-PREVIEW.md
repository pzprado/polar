# Task 4: Preview System (Sandpack + Code Viewer)

**Priority**: Can run in parallel after Task 0 completes
**Estimated time**: ~25 minutes
**Dependencies**: Task 0 (types, shadcn/ui components)
**Parallel with**: Tasks 1, 2, 3, 5
**Used by**: Task 6 (builder page integrates these components)

## Objective

Build the Sandpack-based live preview system and tabbed code viewer that will be used in the builder page. These are self-contained components that receive generated code as props and render it.

## Files to Create

| File | Purpose |
|------|---------|
| `src/lib/preview/sandpack-config.ts` | Sandpack theme, dependencies, bundler options |
| `src/lib/preview/template-files.ts` | Base files for Sandpack (entry point, HTML shell) |
| `src/components/builder/preview-panel.tsx` | Sandpack wrapper component |
| `src/components/builder/code-viewer.tsx` | Tabbed code viewer (Frontend / Contract) |

## Component Details

### `src/lib/preview/sandpack-config.ts`

Sandpack configuration including theme and dependency versions.

```typescript
import type { SandpackTheme } from "@codesandbox/sandpack-react";

export const polarSandpackTheme: SandpackTheme = {
  colors: {
    surface1: "#ffffff",        // Editor background
    surface2: "#f8f9fa",        // Inactive tab background
    surface3: "#f1f3f5",        // Input/status bar background
    clickable: "#6b7280",       // Clickable elements
    base: "#1f2937",            // Default text
    disabled: "#9ca3af",        // Disabled text
    hover: "#E84142",           // Hover accent (Avalanche red)
    accent: "#E84142",          // Accent color
    error: "#ef4444",           // Error color
    errorSurface: "#fef2f2",    // Error background
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
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"Fira Code", "JetBrains Mono", "Cascadia Code", Menlo, monospace',
    size: "13px",
    lineHeight: "1.6",
  },
};

export const sandpackDependencies: Record<string, string> = {
  ethers: "^6.9.0",
};

// Custom setup for Sandpack
export const sandpackCustomSetup = {
  dependencies: sandpackDependencies,
};
```

### `src/lib/preview/template-files.ts`

Base files that Sandpack needs to render the generated React component.

```typescript
/**
 * Generate the Sandpack file map for a given frontend component.
 * @param frontendCode - The generated React component code
 * @param contractAddress - Optional deployed contract address
 */
export function getSandpackFiles(
  frontendCode: string,
  contractAddress?: string
): Record<string, string> {
  return {
    "/App.js": frontendCode,
    "/index.js": getEntryFile(),
    "/index.html": getHtmlFile(),
    "/setup.js": getSetupFile(contractAddress),
  };
}

function getEntryFile(): string {
  return `
import React from "react";
import { createRoot } from "react-dom/client";
import "./setup.js";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
`;
}

function getHtmlFile(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Polar Preview</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #ffffff;
      color: #1f2937;
    }
    #root { min-height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>
</body>
</html>
`;
}

function getSetupFile(contractAddress?: string): string {
  // Inject the contract address as a global variable
  // The generated React component checks for this
  return `
// Polar setup — injects contract address if deployed
if (typeof window !== "undefined") {
  window.__POLAR_CONTRACT_ADDRESS__ = ${contractAddress ? `"${contractAddress}"` : "null"};
}
`;
}
```

### `src/components/builder/preview-panel.tsx`

The live preview component that wraps Sandpack.

```typescript
"use client";

import { SandpackProvider, SandpackPreview } from "@codesandbox/sandpack-react";
import { polarSandpackTheme, sandpackCustomSetup } from "@/lib/preview/sandpack-config";
import { getSandpackFiles } from "@/lib/preview/template-files";
import { Skeleton } from "@/components/ui/skeleton";

interface PreviewPanelProps {
  frontendCode: string | null;    // null = not yet generated
  contractAddress?: string;       // set after deployment
}

export function PreviewPanel({ frontendCode, contractAddress }: PreviewPanelProps) {
  // Show placeholder when no code is generated yet
  if (!frontendCode) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border">
        <div className="text-center text-gray-400 space-y-2">
          <div className="text-4xl">🏔</div>
          <p className="text-sm">Your app preview will appear here</p>
          <p className="text-xs text-gray-300">Describe what you want to build</p>
        </div>
      </div>
    );
  }

  const files = getSandpackFiles(frontendCode, contractAddress);

  return (
    <div className="h-full rounded-lg overflow-hidden border">
      <SandpackProvider
        template="react"
        theme={polarSandpackTheme}
        customSetup={sandpackCustomSetup}
        files={files}
        options={{
          externalResources: [],
          autorun: true,
          autoReload: true,
        }}
      >
        <SandpackPreview
          style={{ height: "100%" }}
          showOpenInCodeSandbox={false}
          showRefreshButton={true}
        />
      </SandpackProvider>
    </div>
  );
}
```

**Key behaviors**:
- When `frontendCode` is null: show a placeholder/skeleton state
- When `frontendCode` is set: render Sandpack with the generated code
- When `contractAddress` is set: reinitialize Sandpack with the address injected
- Sandpack runs entirely in-browser — no server needed for preview

### `src/components/builder/code-viewer.tsx`

Tabbed code viewer showing Frontend and Contract tabs.

```typescript
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

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
    <Tabs defaultValue="frontend" className="h-full flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <TabsList className="h-8">
          <TabsTrigger value="frontend" className="text-xs">Frontend</TabsTrigger>
          <TabsTrigger value="contract" className="text-xs">Contract</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="frontend" className="flex-1 m-0">
        {frontendCode ? (
          <div className="relative h-full">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 z-10 h-7 w-7 p-0"
              onClick={() => copyToClipboard(frontendCode, "frontend")}
            >
              {copiedTab === "frontend" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
            <ScrollArea className="h-full">
              <pre className="p-4 text-xs font-mono leading-relaxed text-gray-700 whitespace-pre-wrap">
                {frontendCode}
              </pre>
            </ScrollArea>
          </div>
        ) : (
          <CodePlaceholder label="Frontend code" />
        )}
      </TabsContent>

      <TabsContent value="contract" className="flex-1 m-0">
        {contractSource ? (
          <div className="relative h-full">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 z-10 h-7 w-7 p-0"
              onClick={() => copyToClipboard(contractSource, "contract")}
            >
              {copiedTab === "contract" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
            <ScrollArea className="h-full">
              <pre className="p-4 text-xs font-mono leading-relaxed text-gray-700 whitespace-pre-wrap">
                {contractSource}
              </pre>
            </ScrollArea>
          </div>
        ) : (
          <CodePlaceholder label="Smart contract" />
        )}
      </TabsContent>
    </Tabs>
  );
}

function CodePlaceholder({ label }: { label: string }) {
  return (
    <div className="h-full flex items-center justify-center text-gray-300 text-sm">
      {label} will appear here
    </div>
  );
}
```

## Sandpack Notes

- `@codesandbox/sandpack-react` must be imported as a client component (`"use client"`)
- The `template="react"` gives us React + ReactDOM out of the box
- Custom dependencies (ethers) are specified via `customSetup.dependencies`
- Files are passed as a `Record<string, string>` — filenames as keys, content as values
- The preview iframe is fully isolated — CSS in the preview won't leak out
- `showOpenInCodeSandbox={false}` hides the CodeSandbox export button
- `autorun: true` means the preview updates immediately when code changes

## Styling Notes

- The preview panel should take full height of its container (the center column of the builder)
- The code viewer should also take full height of its container (the right column)
- Both components use `h-full` and expect their parent to set the height
- Code viewer uses `ScrollArea` for scrollable code blocks
- Monospace font for code display
- Copy button in top-right corner of each code tab

## Verification

1. Create a test page that renders `<PreviewPanel frontendCode={null} />` — shows placeholder
2. Pass a simple React component string — Sandpack renders it
3. Code viewer shows tabs, code content, copy button works
4. No TypeScript errors
5. Components render without hydration issues (they're "use client")

## Integration with Builder Page (Task 6)

The builder page will use these components like:

```tsx
<PreviewPanel
  frontendCode={generation?.frontendCode ?? null}
  contractAddress={deployment?.contractAddress}
/>

<CodeViewer
  frontendCode={generation?.frontendCode ?? null}
  contractSource={generation?.contractSource ?? null}
/>
```
