# Polar — Shared Types Reference

All types live in `src/lib/types.ts`. Every task references these types. This is the single source of truth.

```typescript
export type ContractCategory = "token" | "nft" | "game" | "tipping";

export interface ContractTemplate {
  id: ContractCategory;
  name: string;
  description: string;
  soliditySource: string;        // .sol with {{PLACEHOLDERS}}
  parameters: TemplateParameter[];
  abi: any[];
}

export interface TemplateParameter {
  name: string;
  placeholder: string;           // e.g. "{{TOKEN_NAME}}"
  type: "string" | "number" | "address";
  description: string;
  defaultValue?: string;
}

export interface GenerationRequest { prompt: string; }

export interface GenerationResult {
  templateId: ContractCategory;
  contractName: string;
  contractSource: string;        // Filled Solidity (placeholders replaced)
  contractParameters: Record<string, string>;
  frontendCode: string;          // Self-contained React component string
  explanation: string;           // AI's explanation of what it built
}

export interface DeployRequest { contractSource: string; contractName: string; }

export interface DeployResult {
  success: boolean;
  contractAddress?: string;
  transactionHash?: string;
  explorerUrl?: string;
  abi?: any[];
  error?: string;
}

export type BuilderPhase = "idle" | "generating" | "generated" | "deploying" | "deployed";

export interface BuilderState {
  phase: BuilderPhase;
  prompt: string;
  messages: ChatMessage[];
  generation: GenerationResult | null;
  deployment: DeployResult | null;
  error: string | null;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

// Pre-built community template (for dashboard grid)
export interface CommunityTemplate {
  id: string;
  title: string;
  description: string;
  category: ContractCategory;
  prompt: string;              // The prompt that generates this template
  previewImage?: string;
}
```
