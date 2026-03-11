import { NextRequest, NextResponse } from "next/server";
import { buildInterviewPrompt } from "@/lib/ai/interview-prompt";
import { generateWithFallback, LLMMessage } from "@/lib/ai/llm-provider";

export const runtime = "nodejs";

interface InterviewRequest {
  prompt: string;
  history?: { role: "user" | "assistant"; content: string }[];
}

export interface InterviewResponse {
  message: string;
  complete: boolean;
  summary: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const body: InterviewRequest = await request.json();

    if (!body.prompt || body.prompt.trim().length === 0) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const systemPrompt = buildInterviewPrompt();
    const messages: LLMMessage[] = [];

    // Add conversation history
    if (body.history && body.history.length > 0) {
      for (const msg of body.history) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    // Add the current user message
    messages.push({ role: "user", content: body.prompt });

    const result = await generateWithFallback(systemPrompt, messages);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    const parsed = parseInterviewResponse(result.text);

    return NextResponse.json(parsed satisfies InterviewResponse);
  } catch (error) {
    console.error("Interview error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Interview failed" },
      { status: 500 },
    );
  }
}

function parseInterviewResponse(text: string): InterviewResponse {
  const readyMatch = text.match(/<ready_to_build>([\s\S]*?)<\/ready_to_build>/i);

  if (readyMatch) {
    const summary = readyMatch[1].trim();
    const message = text.replace(/<ready_to_build>[\s\S]*?<\/ready_to_build>/i, "").trim();
    return { message, complete: true, summary };
  }

  return { message: text.trim(), complete: false, summary: null };
}
