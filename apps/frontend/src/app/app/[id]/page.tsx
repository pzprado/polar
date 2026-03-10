"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Code, Eye, FileCode2, MessageSquare, Rocket } from "lucide-react";
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

const VIEW_OPTIONS: { id: PanelView; label: string; shortLabel: string; icon: typeof Eye }[] = [
  { id: "preview", label: "Preview", shortLabel: "Preview", icon: Eye },
  { id: "frontend", label: "Frontend", shortLabel: "Front", icon: Code },
  { id: "backend", label: "Backend", shortLabel: "Back", icon: FileCode2 },
];

export default function BuilderPage() {
  const searchParams = useSearchParams();
  const { state, generate, setDeployment, setPhase } = useGeneration();
  const { deploying, result: deployResult, error: deployError, deploy } = useDeploy();
  const [activeView, setActiveView] = useState<PanelView>("preview");
  const [mobileTab, setMobileTab] = useState<"chat" | "panel">("chat");

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

  // Auto-switch to panel view on mobile when generation completes
  useEffect(() => {
    if (state.phase === "generated" && state.generation) {
      setMobileTab("panel");
    }
  }, [state.phase, state.generation]);

  const handleDeploy = async () => {
    if (!state.generation) return;
    setPhase("deploying");
    await deploy(state.generation.contractSource, state.generation.contractName);
  };

  const appName = state.generation?.contractName || "New App";

  return (
    <div
      className={`${dmSans.variable} ${spaceGrotesk.variable} flex h-dvh flex-col bg-[#0B101B]`}
      style={{ fontFamily: "var(--font-dm-sans)" }}
    >
      {/* ─── Header ─── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-3 sm:px-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Logo variant="dark" />
          <div className="hidden h-5 w-px bg-white/10 sm:block" />
          <span className="hidden text-sm font-medium text-[#8b919e] sm:block truncate">{appName}</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {deployResult?.success && (
            <span className="flex items-center gap-1.5 text-xs text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="hidden sm:inline">Live</span>
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

      {/* ─── Desktop Body (2-column) ─── */}
      <div className="hidden min-h-0 flex-1 overflow-hidden md:flex">
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

      {/* ─── Mobile Body (single column with tab switch) ─── */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:hidden">
        {/* Mobile content area */}
        <div className="min-h-0 flex-1 overflow-hidden">
          {mobileTab === "chat" ? (
            <ChatPanel
              messages={state.messages}
              generating={state.phase === "generating"}
              onSendMessage={(message) => void generate(message)}
            />
          ) : (
            <div className="flex h-full flex-col bg-[#0B101B]">
              {/* Mobile panel header with compact toggle */}
              <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5">
                <p className="text-sm font-semibold text-white">
                  {activeView === "preview" ? "Preview" : activeView === "frontend" ? "Frontend" : "Contract"}
                </p>

                <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-0.5">
                  {VIEW_OPTIONS.map(({ id, shortLabel, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setActiveView(id)}
                      className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
                        activeView === id
                          ? "bg-white/10 text-white"
                          : "text-[#5c6370]"
                      }`}
                      aria-pressed={activeView === id}
                    >
                      <Icon className="h-3 w-3" />
                      {shortLabel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Panel content */}
              <div className="min-h-0 flex-1 p-3">
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

              {/* Deploy result on mobile */}
              {deployResult && (
                <div className="border-t border-white/10 p-3">
                  <DeployResultPanel result={deployResult} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── Mobile Bottom Tab Bar ─── */}
        <div className="flex shrink-0 border-t border-white/10 bg-[#0B101B]">
          <button
            type="button"
            onClick={() => setMobileTab("chat")}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
              mobileTab === "chat" ? "text-[#E84142]" : "text-[#5c6370]"
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            Chat
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("panel")}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
              mobileTab === "panel" ? "text-[#E84142]" : "text-[#5c6370]"
            }`}
          >
            <Eye className="h-5 w-5" />
            Output
          </button>
        </div>
      </div>
    </div>
  );
}
