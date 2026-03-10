"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ChatPanel } from "@/components/builder/chat-panel";
import { CodeViewer } from "@/components/builder/code-viewer";
import { DeployButton } from "@/components/builder/deploy-button";
import { DeployResultPanel } from "@/components/builder/deploy-result";
import { PreviewPanel } from "@/components/builder/preview-panel";
import { Logo } from "@/components/shared/logo";
import { useDeploy } from "@/hooks/use-deploy";
import { useGeneration } from "@/hooks/use-generation";

export default function BuilderPage() {
  const searchParams = useSearchParams();
  const { state, generate, setDeployment, setPhase } = useGeneration();
  const { deploying, result: deployResult, error: deployError, deploy } = useDeploy();

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
    <div className="flex h-screen flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4">
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

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="w-[340px] shrink-0">
          <ChatPanel
            messages={state.messages}
            generating={state.phase === "generating"}
            onSendMessage={(message) => void generate(message)}
          />
        </div>

        <div className="min-h-0 flex-1 p-4">
          <PreviewPanel
            frontendCode={state.generation?.frontendCode ?? null}
            contractAddress={deployResult?.contractAddress}
          />
        </div>

        <div className="flex w-[320px] shrink-0 flex-col border-l border-gray-200 bg-white">
          <div className="min-h-0 flex-1 overflow-hidden">
            <CodeViewer
              frontendCode={state.generation?.frontendCode ?? null}
              contractSource={state.generation?.contractSource ?? null}
            />
          </div>

          {deployResult && (
            <div className="border-t border-gray-200 p-3">
              <DeployResultPanel result={deployResult} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
