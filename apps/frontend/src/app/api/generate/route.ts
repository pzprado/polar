import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt, buildCurrentCodeContext } from "@/lib/ai/prompt-builder";
import { parseGenerationResponse } from "@/lib/ai/response-parser";
import { fillTemplate } from "@/lib/contracts/templates";
import { GenerationRequest } from "@/lib/types";

export const runtime = "nodejs";

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";
const OLLAMA_BASE_URL = (process.env.OLLAMA_BASE_URL || "http://localhost:11434").replace(/\/$/, "");
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "kimi-k2.5";
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;

interface LLMMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerationRequest = await request.json();

    if (!body.prompt || body.prompt.trim().length === 0) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const systemPrompt = buildSystemPrompt();
    const messages = buildMessages(body);
    const providerResult = await generateWithFallback(systemPrompt, messages);

    if (!providerResult.ok) {
      return NextResponse.json({ error: providerResult.error }, { status: 500 });
    }

    const result = parseGenerationResponse(providerResult.text);
    result.contractSource = fillTemplate(result.templateId, result.contractParameters);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 },
    );
  }
}

function buildMessages(body: GenerationRequest): LLMMessage[] {
  const hasExistingCode = body.currentFrontendCode || body.currentContractSource;
  const hasHistory = body.history && body.history.length > 0;

  // First generation — no history, no existing code
  if (!hasHistory && !hasExistingCode) {
    return [{ role: "user", content: body.prompt }];
  }

  const messages: LLMMessage[] = [];

  // If there's existing code, inject it as context at the start of the conversation
  if (hasExistingCode) {
    const codeContext = buildCurrentCodeContext({
      frontendCode: body.currentFrontendCode,
      contractSource: body.currentContractSource,
      templateId: body.currentTemplateId,
      contractParameters: body.currentContractParameters,
    });

    // Add code context as a system-like user message at the start
    messages.push({ role: "user", content: codeContext });
    messages.push({
      role: "assistant",
      content: "I understand the current state of the app. I'll modify it based on your next request, keeping everything that works and only changing what you ask for.",
    });
  }

  // Add chat history (skip if it would duplicate the current prompt)
  if (hasHistory) {
    for (const msg of body.history!) {
      messages.push({ role: msg.role, content: msg.content });
    }
  }

  // Add the current user prompt
  messages.push({ role: "user", content: body.prompt });

  return messages;
}

type ProviderSuccess = { ok: true; text: string; provider: "anthropic" | "ollama" };
type ProviderFailure = { ok: false; error: string };
type ProviderResult = ProviderSuccess | ProviderFailure;

async function generateWithFallback(systemPrompt: string, messages: LLMMessage[]): Promise<ProviderResult> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  let anthropicError: string | null = null;

  if (anthropicKey) {
    const anthropicResult = await generateWithAnthropic(anthropicKey, systemPrompt, messages);
    if (anthropicResult.ok) {
      return anthropicResult;
    }

    anthropicError = anthropicResult.error;
    console.error("Anthropic generation failed, attempting Ollama fallback:", anthropicError);
  }

  const ollamaResult = await generateWithOllama(systemPrompt, messages);
  if (ollamaResult.ok) {
    return ollamaResult;
  }

  if (!anthropicKey) {
    return {
      ok: false,
      error:
        "No AI provider available. Set ANTHROPIC_API_KEY or configure OLLAMA_BASE_URL/OLLAMA_MODEL for Ollama fallback.",
    };
  }

  return {
    ok: false,
    error: `Anthropic failed (${anthropicError || "unknown error"}) and Ollama fallback failed (${ollamaResult.error}).`,
  };
}

async function generateWithAnthropic(
  apiKey: string,
  systemPrompt: string,
  messages: LLMMessage[],
): Promise<ProviderResult> {
  try {
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const responseText = (message.content as Array<{ type: string; text?: string }>)
      .map((block) => (block.type === "text" ? block.text || "" : ""))
      .join("\n")
      .trim();

    if (!responseText) {
      return { ok: false, error: "Anthropic returned an empty response" };
    }

    return { ok: true, text: responseText, provider: "anthropic" };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Anthropic request failed",
    };
  }
}

interface OllamaChatResponse {
  message?: {
    content?: string;
  };
  error?: string;
}

async function generateWithOllama(systemPrompt: string, messages: LLMMessage[]): Promise<ProviderResult> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (OLLAMA_API_KEY) {
      headers.Authorization = `Bearer ${OLLAMA_API_KEY}`;
    }

    const ollamaMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        messages: ollamaMessages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { ok: false, error: `Ollama request failed (${response.status}): ${errorText || response.statusText}` };
    }

    const data = (await response.json()) as OllamaChatResponse;
    const text = data.message?.content?.trim();

    if (!text) {
      return {
        ok: false,
        error: data.error || "Ollama returned an empty response",
      };
    }

    return { ok: true, text, provider: "ollama" };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Ollama request failed",
    };
  }
}
