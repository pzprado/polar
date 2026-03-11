import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt, buildCurrentCodeContext } from "@/lib/ai/prompt-builder";
import { generateWithFallback, LLMMessage } from "@/lib/ai/llm-provider";
import { parseGenerationResponse } from "@/lib/ai/response-parser";
import { fillTemplate } from "@/lib/contracts/templates";
import { GenerationRequest } from "@/lib/types";

export const runtime = "nodejs";

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
  const hasExistingCode = body.currentFrontendCode || body.currentFrontendFiles || body.currentContractSource;
  const hasHistory = body.history && body.history.length > 0;

  // Build the user prompt, enriched with interview context if available
  const userPrompt = body.interviewSummary
    ? `${body.prompt}\n\n## Product Brief (from user interview)\n${body.interviewSummary}\n\nUse this brief to make informed decisions about the app's design, features, copy, target audience, and user experience.`
    : body.prompt;

  // First generation — no history, no existing code
  if (!hasHistory && !hasExistingCode) {
    return [{ role: "user", content: userPrompt }];
  }

  const messages: LLMMessage[] = [];

  // If there's existing code, inject it as context at the start of the conversation
  if (hasExistingCode) {
    const codeContext = buildCurrentCodeContext({
      frontendCode: body.currentFrontendCode,
      frontendFiles: body.currentFrontendFiles,
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
  messages.push({ role: "user", content: userPrompt });

  return messages;
}
