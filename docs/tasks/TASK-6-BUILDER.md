# Task 6: Builder Page Integration

**Priority**: Must wait for Tasks 1-5 to complete
**Estimated time**: ~45 minutes
**Dependencies**: ALL of Tasks 1-5
**Blocks**: Task 7 (polish)

## Objective

Build the 3-column builder page at `/app/[id]` that integrates the chat panel, live preview (Sandpack), code viewer, and deploy system. This is the main app editing experience, inspired by the Hercules app editor.

## Files to Create

| File | Purpose |
|------|---------|
| `src/app/app/[id]/page.tsx` | 3-column builder layout |
| `src/components/builder/chat-panel.tsx` | Left panel: chat messages + prompt input |
| `src/components/builder/prompt-input.tsx` | Textarea + send button |
| `src/components/builder/generation-status.tsx` | Loading indicator during AI generation |
| `src/hooks/use-generation.ts` | Hook managing BuilderState, API calls, chat history |

## Layout Spec

```
┌──────────────────────────────────────────────────────────┐
│  🏔 Polar    App Name           [v1 ▾]  [Deploy to Avalanche] │
├────────────┬─────────────────────────────┬───────────────┤
│  Chat      │                             │  📁 Code      │
│  ────      │     Live Preview            │  ────         │
│  AI chat   │     (Sandpack iframe)       │  Frontend tab │
│  messages  │                             │  Contract tab │
│  ...       │                             │               │
│            │                             │  [ABI]        │
│  ────────  │                             │  [Address]    │
│  [prompt]  │                             │  [Explorer↗]  │
│  [🔵 Send] │                             │               │
└────────────┴─────────────────────────────┴───────────────┘
```

**Column widths** (desktop):
- Left (chat): ~30% / 350px
- Center (preview): flex-1 / ~45%
- Right (code + deploy): ~25% / 300px

**Full height**: The builder page should fill the viewport (h-screen minus top bar).

## Components from Other Tasks (Already Built)

These components are imported from their respective tasks:

```typescript
// From Task 1
import { Logo } from "@/components/shared/logo";

// From Task 4
import { PreviewPanel } from "@/components/builder/preview-panel";
import { CodeViewer } from "@/components/builder/code-viewer";

// From Task 5
import { DeployButton } from "@/components/builder/deploy-button";
import { DeployResultPanel } from "@/components/builder/deploy-result";
import { useDeploy } from "@/hooks/use-deploy";
```

## Generation Hook (`src/hooks/use-generation.ts`)

Manages the full builder state lifecycle.

```typescript
"use client";

import { useState, useCallback } from "react";
import { BuilderState, GenerationResult, ChatMessage, BuilderPhase } from "@/lib/types";

export function useGeneration() {
  const [state, setState] = useState<BuilderState>({
    phase: "idle",
    prompt: "",
    messages: [],
    generation: null,
    deployment: null,
    error: null,
  });

  const generate = useCallback(async (prompt: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    };

    setState((prev) => ({
      ...prev,
      phase: "generating",
      prompt,
      messages: [...prev.messages, userMessage],
      error: null,
    }));

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Generation failed");
      }

      const result: GenerationResult = await response.json();

      // Add assistant message with the explanation
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: result.explanation,
        timestamp: Date.now(),
      };

      setState((prev) => ({
        ...prev,
        phase: "generated",
        generation: result,
        messages: [...prev.messages, assistantMessage],
      }));

      return result;
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: Date.now(),
      };

      setState((prev) => ({
        ...prev,
        phase: "idle",
        error: error.message,
        messages: [...prev.messages, errorMessage],
      }));

      return null;
    }
  }, []);

  const setDeployment = useCallback((deployment: BuilderState["deployment"]) => {
    setState((prev) => ({
      ...prev,
      phase: deployment?.success ? "deployed" : prev.phase,
      deployment,
    }));
  }, []);

  const setPhase = useCallback((phase: BuilderPhase) => {
    setState((prev) => ({ ...prev, phase }));
  }, []);

  return {
    state,
    generate,
    setDeployment,
    setPhase,
  };
}
```

## Chat Panel (`src/components/builder/chat-panel.tsx`)

Left sidebar with chat messages and prompt input.

```typescript
"use client";

import { useRef, useEffect } from "react";
import { ChatMessage } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PromptInput } from "./prompt-input";
import { GenerationStatus } from "./generation-status";

interface ChatPanelProps {
  messages: ChatMessage[];
  generating: boolean;
  onSendMessage: (message: string) => void;
}

export function ChatPanel({ messages, generating, onSendMessage }: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, generating]);

  return (
    <div className="h-full flex flex-col border-r">
      {/* Header */}
      <div className="px-4 py-3 border-b">
        <h2 className="text-sm font-semibold text-gray-900">Chat</h2>
        <p className="text-xs text-gray-500">Describe what you want to build</p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4">
        <div className="py-4 space-y-4">
          {messages.length === 0 && !generating && (
            <p className="text-sm text-gray-400 text-center py-8">
              Send a message to start building
            </p>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "bg-[#E84142] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {generating && <GenerationStatus />}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Prompt input at bottom */}
      <div className="p-3 border-t">
        <PromptInput onSubmit={onSendMessage} disabled={generating} />
      </div>
    </div>
  );
}
```

## Prompt Input (`src/components/builder/prompt-input.tsx`)

```typescript
"use client";

import { useState, KeyboardEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface PromptInputProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function PromptInput({
  onSubmit,
  disabled = false,
  placeholder = "Describe what you want to build...",
}: PromptInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed && !disabled) {
      onSubmit(trimmed);
      setValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="min-h-[44px] max-h-[120px] resize-none text-sm"
        rows={1}
      />
      <Button
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        size="sm"
        className="bg-[#E84142] hover:bg-[#d13a3b] text-white h-[44px] w-[44px] p-0 shrink-0"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

## Generation Status (`src/components/builder/generation-status.tsx`)

```typescript
"use client";

import { Loader2 } from "lucide-react";

export function GenerationStatus() {
  return (
    <div className="flex items-start gap-2">
      <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-600 flex items-center gap-2">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Generating your app...</span>
      </div>
    </div>
  );
}
```

## Builder Page (`src/app/app/[id]/page.tsx`)

This is the main integration page.

```typescript
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { ChatPanel } from "@/components/builder/chat-panel";
import { PreviewPanel } from "@/components/builder/preview-panel";
import { CodeViewer } from "@/components/builder/code-viewer";
import { DeployButton } from "@/components/builder/deploy-button";
import { DeployResultPanel } from "@/components/builder/deploy-result";
import { useGeneration } from "@/hooks/use-generation";
import { useDeploy } from "@/hooks/use-deploy";

export default function BuilderPage() {
  const searchParams = useSearchParams();
  const { state, generate, setDeployment, setPhase } = useGeneration();
  const { deploying, result: deployResult, error: deployError, deploy } = useDeploy();

  // Auto-generate on mount if prompt is in URL
  useEffect(() => {
    const prompt = searchParams.get("prompt");
    if (prompt && state.phase === "idle" && state.messages.length === 0) {
      generate(decodeURIComponent(prompt));
    }
  }, [searchParams]); // Only run on mount — intentionally exclude generate/state

  // Sync deploy result into builder state
  useEffect(() => {
    if (deployResult) {
      setDeployment(deployResult);
    }
  }, [deployResult, setDeployment]);

  const handleDeploy = async () => {
    if (!state.generation) return;
    setPhase("deploying");
    await deploy(state.generation.contractSource, state.generation.contractName);
  };

  const appName = state.generation?.contractName || "New App";

  return (
    <div className="h-screen flex flex-col">
      {/* Top bar */}
      <header className="h-14 border-b flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="text-sm font-medium text-gray-700">{appName}</span>
        </div>
        <DeployButton
          onDeploy={handleDeploy}
          deploying={deploying}
          deployed={deployResult?.success ?? false}
          disabled={state.phase !== "generated" && state.phase !== "deployed"}
          error={deployError}
        />
      </header>

      {/* 3-column layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat */}
        <div className="w-[350px] shrink-0">
          <ChatPanel
            messages={state.messages}
            generating={state.phase === "generating"}
            onSendMessage={generate}
          />
        </div>

        {/* Center: Preview */}
        <div className="flex-1 p-4">
          <PreviewPanel
            frontendCode={state.generation?.frontendCode ?? null}
            contractAddress={deployResult?.contractAddress}
          />
        </div>

        {/* Right: Code + Deploy Result */}
        <div className="w-[300px] shrink-0 border-l flex flex-col">
          <div className="flex-1 overflow-hidden">
            <CodeViewer
              frontendCode={state.generation?.frontendCode ?? null}
              contractSource={state.generation?.contractSource ?? null}
            />
          </div>

          {/* Deploy result appears below code viewer */}
          {deployResult && (
            <div className="p-3 border-t">
              <DeployResultPanel result={deployResult} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

## Key Behaviors

### 1. Initial Load
- Page reads `?prompt=` from URL query params
- If present, auto-triggers `generate(prompt)` on mount
- Chat panel immediately shows the user's message + "Generating..." indicator

### 2. Generation Flow
- User sends message → chat panel shows user bubble
- Loading indicator appears → AI processes
- AI response arrives → explanation bubble appears in chat, preview + code populate
- Deploy button becomes active

### 3. Iteration
- User can send follow-up messages
- Each generation is stateless (fresh call to /api/generate)
- Previous generation is replaced by new one
- Chat history accumulates (but each API call is independent)

### 4. Deployment
- Click "Deploy to Avalanche" → button shows spinner
- API compiles + deploys → result appears below code viewer
- Contract address is injected into Sandpack preview
- Button changes to green "Deployed" state

### 5. App ID
- For MVP, the `[id]` param is purely cosmetic
- "new" is the default ID from the dashboard redirect
- No persistence, no database — all state is in React state

## Routing

- Dashboard redirects to `/app/new?prompt={encoded}`
- The page works regardless of the `[id]` value
- No need for dynamic data fetching based on ID

## Responsive Behavior (nice to have, not blocking)

- On mobile: stack columns vertically (chat on top, preview middle, code bottom)
- Or: show only one panel at a time with tab switching
- For MVP, optimizing for desktop is fine

## Verification

1. Navigate to `/app/new?prompt=Create%20a%20loyalty%20token%20called%20CafePoints`
2. Chat panel shows the prompt as a user message
3. "Generating..." indicator appears
4. After generation: AI explanation appears in chat, preview shows the app, code tabs show React + Solidity
5. "Deploy to Avalanche" button is now active
6. Click deploy → spinner → success result with contract address
7. Explorer link works
8. Sending a follow-up message triggers a new generation
9. No TypeScript errors, no console errors
10. Layout fills viewport properly (no scrollbars on the page itself, scrolling within panels)

## Error States to Handle

- Generation fails → error message in chat, user can retry
- Deploy fails → error shown in deploy result card, retry button appears
- API key missing → appropriate error message
- Network issues → generic error with retry option
