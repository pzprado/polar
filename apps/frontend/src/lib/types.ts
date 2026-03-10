export type ContractCategory = "token" | "nft" | "game" | "tipping";

export interface ContractTemplate {
  id: ContractCategory;
  name: string;
  description: string;
  soliditySource: string;
  parameters: TemplateParameter[];
  abi: unknown[];
}

export interface TemplateParameter {
  name: string;
  placeholder: string;
  type: "string" | "number" | "address";
  description: string;
  defaultValue?: string;
}

export interface GenerationRequest {
  prompt: string;
}

export interface GenerationResult {
  templateId: ContractCategory;
  contractName: string;
  contractSource: string;
  contractParameters: Record<string, string>;
  frontendCode: string;
  explanation: string;
}

export interface DeployRequest {
  contractSource: string;
  contractName: string;
}

export interface DeployResult {
  success: boolean;
  contractAddress?: string;
  transactionHash?: string;
  explorerUrl?: string;
  abi?: unknown[];
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

export interface CommunityTemplate {
  id: string;
  title: string;
  description: string;
  category: ContractCategory;
  prompt: string;
  previewImage?: string;
}
