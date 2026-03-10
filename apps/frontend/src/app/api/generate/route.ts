import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/ai/prompt-builder";
import { parseGenerationResponse } from "@/lib/ai/response-parser";
import { GenerationRequest } from "@/lib/types";
import { fillTemplate } from "@/lib/contracts/templates";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body: GenerationRequest = await request.json();

    if (!body.prompt || body.prompt.trim().length === 0) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: buildSystemPrompt(),
      messages: [
        {
          role: "user",
          content: body.prompt,
        },
      ],
    });

    const responseText = (message.content as Array<{ type: string; text?: string }>)
      .map((block) => (block.type === "text" ? block.text || "" : ""))
      .join("\n")
      .trim();

    if (!responseText) {
      return NextResponse.json({ error: "Claude returned an empty response" }, { status: 500 });
    }

    const result = parseGenerationResponse(responseText);
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
