import { ContractCategory, GeneratedFile, GenerationResult } from "@/lib/types";

const VALID_TEMPLATES: ContractCategory[] = ["token", "nft", "game", "tipping"];

export function parseGenerationResponse(rawResponse: string): GenerationResult {
  const templateId = extractTag(rawResponse, "template_id") as ContractCategory | null;
  const contractName = extractTag(rawResponse, "contract_name");
  const parametersRaw = extractTag(rawResponse, "parameters");
  const explanation = extractTag(rawResponse, "explanation");

  // Try multi-file format first, fall back to single-file
  const frontendFiles = parseFrontendFiles(rawResponse);
  const singleFrontendCode = extractTag(rawResponse, "frontend_code");

  if (!templateId || !contractName) {
    throw new Error("Failed to parse AI response: missing required fields");
  }

  if (!frontendFiles.length && !singleFrontendCode) {
    throw new Error("Failed to parse AI response: missing frontend code");
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

  // If multi-file format was found, use it; otherwise wrap single-file into array
  let files: GeneratedFile[];
  let entryComponent: string;

  if (frontendFiles.length > 0) {
    files = frontendFiles;
    entryComponent =
      files.find((f) => f.path === "/App.tsx")?.path ||
      files.find((f) => f.path === "/App.jsx")?.path ||
      files[0].path;
  } else {
    const cleaned = cleanFrontendCode(singleFrontendCode!);
    files = [{ path: "/App.tsx", content: cleaned, description: "Main app component" }];
    entryComponent = "/App.tsx";
  }

  // Derive frontendCode from entry component for backward compat
  const entryFile = files.find((f) => f.path === entryComponent);
  const frontendCode = entryFile?.content || files[0].content;

  return {
    templateId,
    contractName: contractName.trim(),
    contractSource: "",
    contractParameters,
    frontendCode,
    frontendFiles: files,
    entryComponent,
    explanation: explanation?.trim() || "Your app has been generated!",
  };
}

function parseFrontendFiles(text: string): GeneratedFile[] {
  const blockMatch = text.match(/<frontend_files>([\s\S]*?)<\/frontend_files>/i);
  if (!blockMatch) return [];

  const block = blockMatch[1];
  const files: GeneratedFile[] = [];
  const fileRegex = /<file\s+path="([^"]+)"(?:\s+description="([^"]*)")?\s*>([\s\S]*?)<\/file>/gi;
  let match: RegExpExecArray | null;

  while ((match = fileRegex.exec(block)) !== null) {
    const path = match[1];
    const description = match[2] || undefined;
    const content = cleanFrontendCode(match[3]);
    if (path && content) {
      files.push({ path, content, description });
    }
  }

  return files;
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
