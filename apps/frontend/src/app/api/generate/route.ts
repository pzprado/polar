import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/ai/prompt-builder";
import { parseGenerationResponse } from "@/lib/ai/response-parser";
import { fillTemplate } from "@/lib/contracts/templates";
import { GenerationRequest } from "@/lib/types";

export const runtime = "nodejs";

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";
const OLLAMA_BASE_URL = (process.env.OLLAMA_BASE_URL || "http://localhost:11434").replace(/\/$/, "");
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "kimi-k2.5";

export async function POST(request: NextRequest) {
  try {
    const body: GenerationRequest = await request.json();

    if (!body.prompt || body.prompt.trim().length === 0) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const systemPrompt = buildSystemPrompt();
    const providerResult = await generateWithFallback(systemPrompt, body.prompt);

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

type ProviderSuccess = { ok: true; text: string; provider: "anthropic" | "ollama" };
type ProviderFailure = { ok: false; error: string };
type ProviderResult = ProviderSuccess | ProviderFailure;

async function generateWithFallback(systemPrompt: string, userPrompt: string): Promise<ProviderResult> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  let anthropicError: string | null = null;

  if (anthropicKey) {
    const anthropicResult = await generateWithAnthropic(anthropicKey, systemPrompt, userPrompt);
    if (anthropicResult.ok) {
      return anthropicResult;
    }

    anthropicError = anthropicResult.error;
    console.error("Anthropic generation failed, attempting Ollama fallback:", anthropicError);
  }

  const ollamaResult = await generateWithOllama(systemPrompt, userPrompt);
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
  userPrompt: string,
): Promise<ProviderResult> {
  try {
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
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

async function generateWithOllama(systemPrompt: string, userPrompt: string): Promise<ProviderResult> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
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
