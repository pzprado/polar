# Task 3: AI Generation Pipeline

**Priority**: Can run in parallel after Task 0 completes
**Estimated time**: ~40 minutes
**Dependencies**: Task 0 (types, constants)
**Parallel with**: Tasks 1, 2, 4, 5
**Note**: This task creates the `/api/generate` route and the prompt engineering logic. It needs to know about the template definitions from Task 2, but doesn't import from Task 2 at runtime — the template metadata is embedded in the system prompt.

## Objective

Build the AI generation pipeline that takes a user's plain-English prompt, sends it to Claude, and returns a structured `GenerationResult` with a selected template, filled parameters, generated React frontend code, and an explanation.

## Files to Create

| File | Purpose |
|------|---------|
| `src/lib/ai/prompt-builder.ts` | Constructs system prompt with template catalog + output format |
| `src/lib/ai/response-parser.ts` | Parses Claude's response, extracts structured data |
| `src/app/api/generate/route.ts` | POST endpoint: prompt → Claude → GenerationResult |

## Pipeline Flow

```
1. User prompt arrives at /api/generate (POST body: { prompt: string })
2. prompt-builder.ts constructs system prompt containing:
   - Template catalog (4 templates with their params)
   - Output format specification (XML-tagged sections)
   - React code generation instructions
   - Context about Avalanche
3. Call Claude API with system prompt + user prompt
4. response-parser.ts extracts structured data from Claude's response
5. Fill template placeholders server-side (never trust AI to write raw Solidity)
6. Return GenerationResult
```

## System Prompt (`src/lib/ai/prompt-builder.ts`)

```typescript
import { TEMPLATE_SUMMARIES } from "@/lib/constants";

// Template definitions with their parameters — embedded here so the AI knows about them
const TEMPLATE_CATALOG = `
## Available Smart Contract Templates

### 1. token — ERC-20 Token
A fungible token with customizable name, symbol, and initial supply.
Parameters:
- {{TOKEN_NAME}}: Name of the token (string, e.g., "CafePoints")
- {{TOKEN_SYMBOL}}: Short symbol, 3-5 chars (string, e.g., "CAFE")
- {{INITIAL_SUPPLY}}: Number of tokens to mint (number, e.g., 1000000)
ABI functions: name(), symbol(), decimals(), totalSupply(), balanceOf(address), transfer(address,uint256), approve(address,uint256), allowance(address,address), transferFrom(address,address,uint256)

### 2. nft — ERC-721 NFT Collection
A non-fungible token collection with metadata and minting.
Parameters:
- {{NFT_NAME}}: Name of the collection (string, e.g., "PixelPals")
- {{NFT_SYMBOL}}: Short symbol (string, e.g., "PXP")
- {{MAX_SUPPLY}}: Maximum number of NFTs (number, e.g., 100)
- {{BASE_URI}}: Base URI for token metadata (string, e.g., "https://example.com/metadata/")
ABI functions: name(), symbol(), totalSupply(), maxSupply(), balanceOf(address), ownerOf(uint256), mint(), tokenURI(uint256), transferFrom(address,address,uint256)

### 3. game — On-Chain Game
A simple betting/lottery game with entry fees and prizes.
Parameters:
- {{GAME_NAME}}: Name of the game (string, e.g., "CoinFlip")
- {{ENTRY_FEE}}: Entry fee in wei (number, e.g., 100000000000000000 for 0.1 AVAX)
- {{MAX_PLAYERS}}: Max players per round (number, e.g., 10)
ABI functions: gameName(), entryFee(), maxPlayers(), getPlayers(), join() [payable], pickWinner(), getBalance()

### 4. tipping — Tipping / Payments
Accept tips and payments with optional fee splitting.
Parameters:
- {{APP_NAME}}: Name of the tipping app (string, e.g., "PodcastTips")
- {{FEE_PERCENTAGE}}: Platform fee percentage (number, e.g., 5)
ABI functions: appName(), owner(), feePercentage(), tip(string) [payable], getTips(), withdraw(), getBalance()
`;

export function buildSystemPrompt(): string {
  return `You are Polar, an AI that builds web3 apps on Avalanche. Users describe what they want in plain English. You select the best matching smart contract template, fill in the parameters, and generate a React frontend component.

${TEMPLATE_CATALOG}

## Your Task

1. Read the user's prompt carefully.
2. Select the BEST matching template from the 4 above.
3. Extract parameter values from the user's description. Use sensible defaults if not specified.
4. Generate a self-contained React component that provides a UI for interacting with the smart contract.

## Output Format

You MUST respond with EXACTLY this structure using XML tags:

<template_id>token|nft|game|tipping</template_id>

<contract_name>PascalCaseContractName</contract_name>

<parameters>
{
  "{{PLACEHOLDER}}": "value",
  ...
}
</parameters>

<explanation>
A brief, friendly explanation of what you built (2-3 sentences). Written for non-technical users.
</explanation>

<frontend_code>
// Your React component here
// IMPORTANT: This must be a COMPLETE, self-contained React component
// It will be rendered in a Sandpack iframe
</frontend_code>

## React Component Requirements

The frontend_code MUST follow these rules:

1. **Self-contained**: Single file, no imports except React (available globally) and ethers (available globally as window.ethers or from "ethers")
2. **Default export**: The component must be the default export
3. **Styling**: Use inline styles only (no Tailwind, no CSS modules). Keep it clean and modern.
4. **Contract interaction**: Use the ABI and contract address to interact with the deployed contract.
   - Before deployment, show a MOCK/DEMO UI with simulated data
   - The contract address will be injected as \`window.__POLAR_CONTRACT_ADDRESS__\` after deployment
   - Check if the address exists: \`const contractAddress = typeof window !== 'undefined' && window.__POLAR_CONTRACT_ADDRESS__\`
5. **ethers usage**: Use ethers v6 syntax:
   - \`new ethers.BrowserProvider(window.ethereum)\` for provider
   - \`new ethers.Contract(address, abi, signer)\` for contract instance
   - Handle the case where MetaMask is not installed (show the mock UI)
6. **Error handling**: Wrap contract calls in try/catch, show user-friendly error messages
7. **Design**: Clean, modern UI with:
   - White/light background
   - Rounded corners, subtle shadows
   - Avalanche red (#E84142) for primary buttons
   - Proper spacing and typography
   - Responsive layout
8. **Mock mode**: When no contract is deployed yet, show the UI with placeholder/demo data so the preview is useful immediately
9. **Keep it simple**: Focus on the core functionality. Don't build overly complex UIs.

## Important Notes
- Do NOT output raw Solidity code. You only select a template and fill parameters.
- Parameter values must be appropriate for the template (correct types, reasonable values).
- The contract_name should be PascalCase and relate to the user's description.
- For ENTRY_FEE, convert human-readable AVAX amounts to wei (1 AVAX = 1000000000000000000 wei).
- Always provide all parameters for the selected template.
`;
}
```

## Response Parser (`src/lib/ai/response-parser.ts`)

```typescript
import { GenerationResult, ContractCategory } from "@/lib/types";

/**
 * Parse Claude's structured response into a GenerationResult.
 * Uses regex to extract XML-tagged sections.
 * Falls back gracefully if parsing fails.
 */
export function parseGenerationResponse(rawResponse: string): GenerationResult {
  const templateId = extractTag(rawResponse, "template_id") as ContractCategory;
  const contractName = extractTag(rawResponse, "contract_name");
  const parametersRaw = extractTag(rawResponse, "parameters");
  const explanation = extractTag(rawResponse, "explanation");
  const frontendCode = extractTag(rawResponse, "frontend_code");

  if (!templateId || !contractName || !frontendCode) {
    throw new Error("Failed to parse AI response: missing required fields");
  }

  // Validate template ID
  const validTemplates: ContractCategory[] = ["token", "nft", "game", "tipping"];
  if (!validTemplates.includes(templateId)) {
    throw new Error(`Invalid template ID: ${templateId}`);
  }

  // Parse parameters JSON
  let contractParameters: Record<string, string> = {};
  if (parametersRaw) {
    try {
      contractParameters = JSON.parse(parametersRaw.trim());
    } catch {
      // Try to extract key-value pairs manually
      console.warn("Failed to parse parameters JSON, attempting manual extraction");
      contractParameters = extractKeyValuePairs(parametersRaw);
    }
  }

  return {
    templateId,
    contractName: contractName.trim(),
    contractSource: "", // Will be filled by the API route after placeholder replacement
    contractParameters,
    frontendCode: cleanFrontendCode(frontendCode),
    explanation: explanation?.trim() || "Your app has been generated!",
  };
}

/**
 * Extract content between XML tags.
 * Handles multiline content.
 */
function extractTag(text: string, tagName: string): string | null {
  // Try XML tag format first
  const regex = new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`, "i");
  const match = text.match(regex);
  if (match) {
    return match[1].trim();
  }
  return null;
}

/**
 * Clean up frontend code — remove markdown code fences if present.
 */
function cleanFrontendCode(code: string): string {
  let cleaned = code.trim();
  // Remove leading ```jsx or ```tsx or ```javascript
  cleaned = cleaned.replace(/^```(?:jsx?|tsx?|javascript|typescript)?\s*\n?/, "");
  // Remove trailing ```
  cleaned = cleaned.replace(/\n?```\s*$/, "");
  return cleaned.trim();
}

/**
 * Fallback: extract key-value pairs from malformed JSON.
 */
function extractKeyValuePairs(text: string): Record<string, string> {
  const pairs: Record<string, string> = {};
  const regex = /"({{[^}]+}})"\s*:\s*"([^"]*)"/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    pairs[match[1]] = match[2];
  }
  return pairs;
}
```

## API Route (`src/app/api/generate/route.ts`)

```typescript
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GenerationRequest, GenerationResult } from "@/lib/types";
import { buildSystemPrompt } from "@/lib/ai/prompt-builder";
import { parseGenerationResponse } from "@/lib/ai/response-parser";

// Import the template registry to fill placeholders
// This import depends on Task 2 being complete — if not yet available,
// implement a simple inline placeholder replacement
import { contractTemplates, fillTemplate } from "@/lib/contracts/templates";

export async function POST(request: NextRequest) {
  try {
    const body: GenerationRequest = await request.json();

    if (!body.prompt || body.prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey });
    const systemPrompt = buildSystemPrompt();

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: body.prompt,
        },
      ],
    });

    // Extract text content from the response
    const responseText = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    // Parse the structured response
    const result = parseGenerationResponse(responseText);

    // Fill template placeholders to get the actual Solidity source
    // This is the critical safety step — we never use AI-generated Solidity
    const filledSource = fillTemplate(result.templateId, result.contractParameters);
    result.contractSource = filledSource;

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: error.message || "Generation failed" },
      { status: 500 }
    );
  }
}
```

## Integration with Task 2 (Templates)

The API route imports `fillTemplate` from Task 2's template registry. If you're building this in parallel with Task 2:

1. Create a **temporary stub** for the import:

```typescript
// Temporary stub — replace with actual import when Task 2 is complete
function fillTemplate(templateId: string, params: Record<string, string>): string {
  return `// Contract source will be filled when templates are ready\n// Template: ${templateId}\n// Params: ${JSON.stringify(params)}`;
}
```

2. Once Task 2 is complete, replace the stub with the real import.

## Claude API Notes

- Using `@anthropic-ai/sdk` (official SDK)
- Model: Use `claude-sonnet-4-20250514` for speed (can upgrade to Opus for quality)
- Max tokens: 4096 is plenty for template selection + React component
- Non-streaming for simplicity in MVP
- The SDK reads `ANTHROPIC_API_KEY` from env automatically, but we pass it explicitly for clarity

## Error Handling

The route should handle:
1. Missing/empty prompt → 400
2. Missing API key → 500
3. Claude API errors → 500 with error message
4. Parse failures → 500 with "Failed to parse AI response"
5. Invalid template ID → 500 with "Invalid template"

## Verification

1. Start dev server: `pnpm dev`
2. `curl -X POST http://localhost:3000/api/generate -H "Content-Type: application/json" -d '{"prompt": "Create a loyalty token called CafePoints for my coffee shop"}'`
3. Response should be a JSON `GenerationResult` with:
   - `templateId: "token"`
   - `contractName: "CafePoints"` (or similar)
   - `contractParameters` with TOKEN_NAME, TOKEN_SYMBOL, INITIAL_SUPPLY
   - `frontendCode` containing a complete React component
   - `explanation` describing what was built
   - `contractSource` containing filled Solidity (or stub if Task 2 not done)
4. No TypeScript errors
5. Test with all 4 template types to ensure proper selection

## Edge Cases to Handle

- User prompt is ambiguous → AI picks best match, explains in explanation
- User doesn't specify all params → AI uses sensible defaults
- User asks for something outside the 4 templates → AI picks closest match and explains
- Claude returns malformed response → parser falls back gracefully with error
