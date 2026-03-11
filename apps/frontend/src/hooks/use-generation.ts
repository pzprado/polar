"use client";

import { useCallback, useRef, useState } from "react";
import { BuilderPhase, BuilderState, ChatMessage, GenerationRequest, GenerationResult } from "@/lib/types";

interface InterviewApiResponse {
  message: string;
  complete: boolean;
  summary: string | null;
  error?: string;
}

export function useGeneration() {
  const [state, setState] = useState<BuilderState>({
    phase: "idle",
    prompt: "",
    interviewSummary: null,
    messages: [],
    generation: null,
    deployment: null,
    error: null,
  });

  // Ref to track the interview summary for use in auto-triggered generation
  // (avoids stale closure issues with setState batching)
  const interviewSummaryRef = useRef<string | null>(null);

  const generate = useCallback(async (prompt: string, overrideSummary?: string | null) => {
    const userMessage: ChatMessage = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    };

    // Capture current state before updating
    const snapshot = await new Promise<BuilderState>((resolve) => {
      setState((previous) => {
        resolve(previous);
        return {
          ...previous,
          phase: "generating",
          prompt,
          error: null,
          deployment: null,
          messages: [...previous.messages, userMessage],
        };
      });
    });

    const currentGeneration = snapshot.generation;
    const currentMessages = snapshot.messages;
    const summary = overrideSummary !== undefined ? overrideSummary : interviewSummaryRef.current;

    try {
      const requestBody: GenerationRequest = {
        prompt,
        interviewSummary: summary ?? undefined,
        history: currentMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        currentFrontendCode: currentGeneration?.frontendCode ?? undefined,
        currentFrontendFiles: currentGeneration?.frontendFiles ?? undefined,
        currentContractSource: currentGeneration?.contractSource ?? undefined,
        currentTemplateId: currentGeneration?.templateId ?? undefined,
        currentContractParameters: currentGeneration?.contractParameters ?? undefined,
      };

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
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

  const startInterview = useCallback(async (prompt: string) => {
    const userMessage: ChatMessage = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    };

    setState((previous) => ({
      ...previous,
      phase: "interviewing",
      prompt,
      error: null,
      messages: [...previous.messages, userMessage],
    }));

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Interview failed");
      }

      const result: InterviewApiResponse = await response.json();

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: result.message,
        timestamp: Date.now(),
      };

      if (result.complete && result.summary) {
        // Interview completed in one round — store summary and auto-generate
        interviewSummaryRef.current = result.summary;
        setState((previous) => ({
          ...previous,
          interviewSummary: result.summary,
          messages: [...previous.messages, assistantMessage],
        }));
        await generate(prompt, result.summary);
      } else {
        setState((previous) => ({
          ...previous,
          messages: [...previous.messages, assistantMessage],
        }));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Interview failed";

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
    }
  }, [generate]);

  const respondToInterview = useCallback(async (answer: string) => {
    const userMessage: ChatMessage = {
      role: "user",
      content: answer,
      timestamp: Date.now(),
    };

    // Capture messages for building history
    const snapshot = await new Promise<BuilderState>((resolve) => {
      setState((previous) => {
        resolve(previous);
        return {
          ...previous,
          error: null,
          messages: [...previous.messages, userMessage],
        };
      });
    });

    try {
      // Build history from all previous messages (excluding the one we just added,
      // since the answer goes as the `prompt` field)
      const history = snapshot.messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: answer, history }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Interview failed");
      }

      const result: InterviewApiResponse = await response.json();

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: result.message,
        timestamp: Date.now(),
      };

      if (result.complete && result.summary) {
        // Interview done — store summary and auto-trigger generation
        interviewSummaryRef.current = result.summary;
        setState((previous) => ({
          ...previous,
          interviewSummary: result.summary,
          messages: [...previous.messages, assistantMessage],
        }));
        await generate(snapshot.prompt, result.summary);
      } else {
        setState((previous) => ({
          ...previous,
          messages: [...previous.messages, assistantMessage],
        }));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Interview failed";

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
    }
  }, [generate]);

  const skipInterview = useCallback(async () => {
    // Read the prompt from current state, then generate outside the updater
    const currentPrompt = await new Promise<string>((resolve) => {
      setState((previous) => {
        resolve(previous.prompt);
        return previous;
      });
    });
    if (currentPrompt) {
      await generate(currentPrompt);
    }
  }, [generate]);

  const fixError = useCallback(async (errorMessage: string) => {
    // Read current state without modifying it
    const currentState = await new Promise<BuilderState>((resolve) => {
      setState((prev) => {
        resolve(prev);
        return prev;
      });
    });

    // Only auto-fix if we have generated code in the right phase
    if (currentState.phase !== "generated" || !currentState.generation) return null;

    // Transition to generating with a "fixing" message
    const fixingMessage: ChatMessage = {
      role: "assistant",
      content: "Spotted an issue in the preview. Fixing it now...",
      timestamp: Date.now(),
    };

    setState((prev) => ({
      ...prev,
      phase: "generating",
      error: null,
      messages: [...prev.messages, fixingMessage],
    }));

    const summary = interviewSummaryRef.current;

    try {
      const requestBody: GenerationRequest = {
        prompt: `The generated app has an error in the preview. Fix this error while keeping all existing functionality intact:\n\n${errorMessage}`,
        interviewSummary: summary ?? undefined,
        currentFrontendCode: currentState.generation.frontendCode,
        currentFrontendFiles: currentState.generation.frontendFiles,
        currentContractSource: currentState.generation.contractSource,
        currentTemplateId: currentState.generation.templateId,
        currentContractParameters: currentState.generation.contractParameters,
      };

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Fix failed");
      }

      const result: GenerationResult = await response.json();

      const successMessage: ChatMessage = {
        role: "assistant",
        content: result.explanation,
        timestamp: Date.now(),
      };

      setState((prev) => ({
        ...prev,
        phase: "generated",
        generation: result,
        messages: [...prev.messages, successMessage],
      }));

      return result;
    } catch {
      // Silently fail auto-fix — stay in generated phase so user can still interact
      setState((prev) => ({
        ...prev,
        phase: "generated",
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

  return { state, generate, fixError, startInterview, respondToInterview, skipInterview, setDeployment, setPhase };
}
