import Anthropic from "@anthropic-ai/sdk";

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";
const OLLAMA_BASE_URL = (process.env.OLLAMA_BASE_URL || "http://localhost:11434").replace(/\/$/, "");
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "kimi-k2.5";
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;

export interface LLMMessage {
  role: "user" | "assistant";
  content: string;
}

type ProviderSuccess = { ok: true; text: string; provider: "anthropic" | "ollama" };
type ProviderFailure = { ok: false; error: string };
export type ProviderResult = ProviderSuccess | ProviderFailure;

export async function generateWithFallback(systemPrompt: string, messages: LLMMessage[]): Promise<ProviderResult> {
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
