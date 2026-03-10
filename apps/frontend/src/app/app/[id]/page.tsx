"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Code, Eye, FileCode2, Rocket } from "lucide-react";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { ChatPanel } from "@/components/builder/chat-panel";
import { CodeViewer } from "@/components/builder/code-viewer";
import { DeployButton } from "@/components/builder/deploy-button";
import { DeployResultPanel } from "@/components/builder/deploy-result";
import { PreviewPanel } from "@/components/builder/preview-panel";
import { Logo } from "@/components/shared/logo";
import { useDeploy } from "@/hooks/use-deploy";
import { useGeneration } from "@/hooks/use-generation";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

type PanelView = "preview" | "frontend" | "backend";

const VIEW_OPTIONS: { id: PanelView; label: string; icon: typeof Eye }[] = [
  { id: "preview", label: "Preview", icon: Eye },
  { id: "frontend", label: "Frontend", icon: Code },
  { id: "backend", label: "Backend", icon: FileCode2 },
];

export default function BuilderPage() {
  const searchParams = useSearchParams();
  const { state, generate, setDeployment, setPhase } = useGeneration();
  const { deploying, result: deployResult, error: deployError, deploy } = useDeploy();
  const [activeView, setActiveView] = useState<PanelView>("preview");

  useEffect(() => {
    const prompt = searchParams.get("prompt");
    if (prompt && state.phase === "idle" && state.messages.length === 0) {
      void generate(prompt);
    }
  }, [generate, searchParams, state.messages.length, state.phase]);

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
    <div
      className={`${dmSans.variable} ${spaceGrotesk.variable} flex h-screen flex-col bg-[#0B101B]`}
      style={{ fontFamily: "var(--font-dm-sans)" }}
    >
      {/* ─── Header ─── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4">
        <div className="flex items-center gap-4">
          <Logo variant="dark" />
          <div className="h-5 w-px bg-white/10" />
          <span className="text-sm font-medium text-[#8b919e]">{appName}</span>
        </div>

        <div className="flex items-center gap-3">
          {deployResult?.success && (
            <span className="flex items-center gap-1.5 text-xs text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              Live
            </span>
          )}
          <DeployButton
            onDeploy={handleDeploy}
            deploying={deploying}
            deployed={deployResult?.success ?? false}
            disabled={state.phase !== "generated" && state.phase !== "deployed"}
            error={deployError}
          />
        </div>
      </header>

      {/* ─── Body ─── */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Chat Panel */}
        <div className="w-[340px] shrink-0">
          <ChatPanel
            messages={state.messages}
            generating={state.phase === "generating"}
            onSendMessage={(message) => void generate(message)}
          />
        </div>

        {/* Main Panel */}
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Panel Header with Toggle */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              {activeView === "preview" && (
                <>
                  <p className="text-sm font-semibold text-white">Live Preview</p>
                  <p className="text-xs text-[#5c6370]">Your generated app</p>
                </>
              )}
              {activeView === "frontend" && (
                <>
                  <p className="text-sm font-semibold text-white">Frontend Code</p>
                  <p className="text-xs text-[#5c6370]">Generated React component</p>
                </>
              )}
              {activeView === "backend" && (
                <>
                  <p className="text-sm font-semibold text-white">Smart Contract</p>
                  <p className="text-xs text-[#5c6370]">Solidity source code</p>
                </>
              )}
            </div>

            {/* 3-way toggle */}
            <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-0.5">
              {VIEW_OPTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveView(id)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeView === id
                      ? "bg-white/10 text-white"
                      : "text-[#5c6370] hover:text-[#8b919e]"
                  }`}
                  aria-pressed={activeView === id}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Panel Content */}
          <div className="min-h-0 flex-1 p-4">
            {activeView === "preview" && (
              <PreviewPanel
                frontendCode={state.generation?.frontendCode ?? null}
                contractAddress={deployResult?.contractAddress}
              />
            )}
            {activeView === "frontend" && (
              <CodeViewer
                code={state.generation?.frontendCode ?? null}
                language="frontend"
              />
            )}
            {activeView === "backend" && (
              <CodeViewer
                code={state.generation?.contractSource ?? null}
                language="backend"
              />
            )}
          </div>

          {/* Deploy Result (shown at bottom when deployed) */}
          {deployResult && (
            <div className="border-t border-white/10 p-4">
              <DeployResultPanel result={deployResult} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
