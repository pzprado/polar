"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Code, Eye, FileCode2, MessageSquare, Rocket } from "lucide-react";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { ChatPanel } from "@/components/builder/chat-panel";
import { CodeViewer } from "@/components/builder/code-viewer";
import { MultiFileCodeViewer } from "@/components/builder/multi-file-code-viewer";
import { DeployButton } from "@/components/builder/deploy-button";
import { DeployResultPanel } from "@/components/builder/deploy-result";
import { PreviewPanel } from "@/components/builder/preview-panel";
import { SandpackErrorDetail } from "@/components/builder/sandpack-error-reporter";
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

const VIEW_CONFIG: Record<PanelView, { accent: string; activeBg: string; activeText: string }> = {
  preview:  { accent: "text-[#E84142]",  activeBg: "bg-[#E84142]/10", activeText: "text-[#E84142]" },
  frontend: { accent: "text-[#2563EB]",  activeBg: "bg-[#2563EB]/10", activeText: "text-[#2563EB]" },
  backend:  { accent: "text-[#D97706]",  activeBg: "bg-[#D97706]/10", activeText: "text-[#D97706]" },
};

const VIEW_OPTIONS: { id: PanelView; label: string; shortLabel: string; icon: typeof Eye }[] = [
  { id: "preview", label: "Preview", shortLabel: "Preview", icon: Eye },
  { id: "frontend", label: "Frontend", shortLabel: "Front", icon: Code },
  { id: "backend", label: "Backend", shortLabel: "Back", icon: FileCode2 },
];

export default function BuilderPage() {
  const searchParams = useSearchParams();
  const { state, generate, fixError, startInterview, respondToInterview, skipInterview, setDeployment, setPhase } = useGeneration();
  const { deploying, result: deployResult, error: deployError, deploy } = useDeploy();
  const [activeView, setActiveView] = useState<PanelView>("preview");
  const [mobileTab, setMobileTab] = useState<"chat" | "panel">("chat");

  // Auto-fix: track attempts per generation cycle, max 2 retries
  const autoFixCountRef = useRef(0);
  const MAX_AUTO_FIXES = 2;

  // On load: start with product interview instead of immediate generation
  useEffect(() => {
    const prompt = searchParams.get("prompt");
    if (prompt && state.phase === "idle" && state.messages.length === 0) {
      void startInterview(prompt);
    }
  }, [startInterview, searchParams, state.messages.length, state.phase]);

  useEffect(() => {
    if (deployResult) {
      setDeployment(deployResult);
    }
  }, [deployResult, setDeployment]);

  // Auto-switch to panel view on mobile when generation completes + reset auto-fix counter
  useEffect(() => {
    if (state.phase === "generated" && state.generation) {
      setMobileTab("panel");
      autoFixCountRef.current = 0;
    }
  }, [state.phase, state.generation]);

  const handleDeploy = async () => {
    if (!state.generation) return;
    setPhase("deploying");
    await deploy({
      contractSource: state.generation.contractSource,
      contractName: state.generation.contractName,
      frontendFiles: state.generation.frontendFiles,
    });
  };

  // Route messages to interview or generation based on current phase
  const handleSendMessage = (message: string) => {
    autoFixCountRef.current = 0; // Reset auto-fix counter on user action
    if (state.phase === "interviewing") {
      void respondToInterview(message);
    } else {
      void generate(message);
    }
  };

  // Auto-fix preview errors: detect Sandpack errors and ask the AI to fix them
  const handlePreviewError = useCallback(
    (error: SandpackErrorDetail) => {
      if (state.phase === "generated" && autoFixCountRef.current < MAX_AUTO_FIXES) {
        autoFixCountRef.current++;
        void fixError(error);
      }
    },
    [state.phase, fixError],
  );

  const appName = state.generation?.contractName || "New App";

  return (
    <div
      className={`${dmSans.variable} ${spaceGrotesk.variable} flex h-dvh flex-col bg-[#F8F6F3]`}
      style={{ fontFamily: "var(--font-dm-sans)" }}
    >
      {/* ─── Header ─── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-black/[0.06] px-3 sm:px-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Logo variant="dark" />
          <div className="hidden h-5 w-px bg-white/10 sm:block" />
          <span className="hidden text-sm font-medium text-[#78716C] sm:block truncate">{appName}</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {deployResult?.success && (
            deployResult.frontendUrl ? (
              <a
                href={deployResult.frontendUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 transition-colors"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="hidden sm:inline underline">Live</span>
              </a>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-green-600">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="hidden sm:inline">Live</span>
              </span>
            )
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
            interviewing={state.phase === "interviewing"}
            onSendMessage={handleSendMessage}
            onSkipInterview={state.phase === "interviewing" ? skipInterview : undefined}
          />
        </div>

        {/* Main Panel */}
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Panel Header with Toggle */}
          <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-3">
            <div>
              {activeView === "preview" && (
                <>
                  <p className="text-sm font-semibold text-[#1C1917]">Live Preview</p>
                  <p className={`text-xs ${VIEW_CONFIG.preview.activeText} opacity-60`}>Your generated app</p>
                </>
              )}
              {activeView === "frontend" && (
                <>
                  <p className="text-sm font-semibold text-[#1C1917]">Frontend Code</p>
                  <p className={`text-xs ${VIEW_CONFIG.frontend.activeText} opacity-60`}>Generated React component</p>
                </>
              )}
              {activeView === "backend" && (
                <>
                  <p className="text-sm font-semibold text-[#1C1917]">Backend Logic</p>
                  <p className={`text-xs ${VIEW_CONFIG.backend.activeText} opacity-60`}>Generated backend code</p>
                </>
              )}
            </div>

            {/* 3-way toggle */}
            <div className="flex items-center rounded-lg border border-black/[0.06] bg-black/[0.03] p-0.5">
              {VIEW_OPTIONS.map(({ id, label, icon: Icon }) => {
                const isActive = activeView === id;
                const config = VIEW_CONFIG[id];
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveView(id)}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? `${config.activeBg} ${config.activeText}`
                        : "text-[#A8A29E] hover:text-[#78716C]"
                    }`}
                    aria-pressed={isActive}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel Content */}
          <div className="min-h-0 flex-1 p-4">
            {activeView === "preview" && (
              <PreviewPanel
                frontendFiles={state.generation?.frontendFiles ?? null}
                contractAddress={deployResult?.contractAddress}
                templateId={state.generation?.templateId}
                contractParams={state.generation?.contractParameters}
                onError={handlePreviewError}
              />
            )}
            {activeView === "frontend" && (
              <MultiFileCodeViewer files={state.generation?.frontendFiles ?? null} />
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
            <div className="border-t border-black/[0.06] p-4">
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
              interviewing={state.phase === "interviewing"}
              onSendMessage={handleSendMessage}
              onSkipInterview={state.phase === "interviewing" ? skipInterview : undefined}
            />
          ) : (
            <div className="flex h-full flex-col bg-[#F8F6F3]">
              {/* Mobile panel header with compact toggle */}
              <div className="flex items-center justify-between border-b border-black/[0.06] px-3 py-2.5">
                <p className="text-sm font-semibold text-[#1C1917]">
                  {activeView === "preview" ? "Preview" : activeView === "frontend" ? "Frontend" : "Backend"}
                </p>

                <div className="flex items-center rounded-lg border border-black/[0.06] bg-black/[0.03] p-0.5">
                  {VIEW_OPTIONS.map(({ id, shortLabel, icon: Icon }) => {
                    const isActive = activeView === id;
                    const config = VIEW_CONFIG[id];
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setActiveView(id)}
                        className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
                          isActive
                            ? `${config.activeBg} ${config.activeText}`
                            : "text-[#A8A29E]"
                        }`}
                        aria-pressed={isActive}
                      >
                        <Icon className="h-3 w-3" />
                        {shortLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Panel content */}
              <div className="min-h-0 flex-1 p-3">
                {activeView === "preview" && (
                  <PreviewPanel
                    frontendFiles={state.generation?.frontendFiles ?? null}
                    contractAddress={deployResult?.contractAddress}
                    templateId={state.generation?.templateId}
                    contractParams={state.generation?.contractParameters}
                    onError={handlePreviewError}
                  />
                )}
                {activeView === "frontend" && (
                  <MultiFileCodeViewer files={state.generation?.frontendFiles ?? null} />
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
                <div className="border-t border-black/[0.06] p-3">
                  <DeployResultPanel result={deployResult} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── Mobile Bottom Tab Bar ─── */}
        <div className="flex shrink-0 border-t border-black/[0.06] bg-[#F8F6F3]">
          <button
            type="button"
            onClick={() => setMobileTab("chat")}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
              mobileTab === "chat" ? "text-[#E84142]" : "text-[#A8A29E]"
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            Chat
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("panel")}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
              mobileTab === "panel" ? "text-[#E84142]" : "text-[#A8A29E]"
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
