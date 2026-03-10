"use client";

import { useCallback, useState } from "react";
import { BuilderPhase, BuilderState, ChatMessage, GenerationResult } from "@/lib/types";

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
    const userMessage: ChatMessage = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    };

    setState((previous) => ({
      ...previous,
      phase: "generating",
      prompt,
      error: null,
      deployment: null,
      messages: [...previous.messages, userMessage],
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

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: result.explanation,
        timestamp: Date.now(),
      };

      setState((previous) => ({
        ...previous,
        phase: "generated",
        generation: result,
        messages: [...previous.messages, assistantMessage],
      }));

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Generation failed";

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: `Sorry, I encountered an error: ${message}. Please try again.`,
        timestamp: Date.now(),
      };

      setState((previous) => ({
        ...previous,
        phase: "idle",
        error: message,
        messages: [...previous.messages, assistantMessage],
      }));

      return null;
    }
  }, []);

  const setDeployment = useCallback((deployment: BuilderState["deployment"]) => {
    setState((previous) => ({
      ...previous,
      phase: deployment?.success ? "deployed" : previous.phase,
      deployment,
    }));
  }, []);

  const setPhase = useCallback((phase: BuilderPhase) => {
    setState((previous) => ({ ...previous, phase }));
  }, []);

  return { state, generate, setDeployment, setPhase };
}
