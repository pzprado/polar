import { ContractCategory, GenerationResult } from "@/lib/types";

const VALID_TEMPLATES: ContractCategory[] = ["token", "nft", "game", "tipping"];

export function parseGenerationResponse(rawResponse: string): GenerationResult {
  const templateId = extractTag(rawResponse, "template_id") as ContractCategory | null;
  const contractName = extractTag(rawResponse, "contract_name");
  const parametersRaw = extractTag(rawResponse, "parameters");
  const explanation = extractTag(rawResponse, "explanation");
  const frontendCode = extractTag(rawResponse, "frontend_code");

  if (!templateId || !contractName || !frontendCode) {
    throw new Error("Failed to parse AI response: missing required fields");
  }

  if (!VALID_TEMPLATES.includes(templateId)) {
    throw new Error(`Invalid template ID: ${templateId}`);
  }

  let contractParameters: Record<string, string> = {};

  if (parametersRaw) {
    try {
      contractParameters = JSON.parse(parametersRaw.trim());
    } catch {
      contractParameters = extractKeyValuePairs(parametersRaw);
    }
  }

  return {
    templateId,
    contractName: contractName.trim(),
    contractSource: "",
    contractParameters,
    frontendCode: cleanFrontendCode(frontendCode),
    explanation: explanation?.trim() || "Your app has been generated!",
  };
}

function extractTag(text: string, tagName: string): string | null {
  const regex = new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`, "i");
  const match = text.match(regex);
  return match?.[1]?.trim() || null;
}

function cleanFrontendCode(code: string): string {
  let cleaned = code.trim();
  cleaned = cleaned.replace(/^```(?:jsx?|tsx?|javascript|typescript)?\s*\n?/, "");
  cleaned = cleaned.replace(/\n?```\s*$/, "");
  return cleaned.trim();
}

function extractKeyValuePairs(text: string): Record<string, string> {
  const pairs: Record<string, string> = {};
  const regex = /"({{[^}]+}})"\s*:\s*"([^"]*)"/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    pairs[match[1]] = match[2];
  }

  return pairs;
}
