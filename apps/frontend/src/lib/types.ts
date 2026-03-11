export type ContractCategory = "token" | "nft" | "game" | "tipping";

export interface GeneratedFile {
  path: string;        // e.g., "/components/TipForm.jsx"
  content: string;
  description?: string;
}

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
  interviewSummary?: string;
  history?: { role: "user" | "assistant"; content: string }[];
  currentFrontendCode?: string;
  currentFrontendFiles?: GeneratedFile[];
  currentContractSource?: string;
  currentTemplateId?: ContractCategory;
  currentContractParameters?: Record<string, string>;
}

export interface GenerationResult {
  templateId: ContractCategory;
  contractName: string;
  contractSource: string;
  contractParameters: Record<string, string>;
  frontendCode: string;
  frontendFiles: GeneratedFile[];
  entryComponent: string;
  explanation: string;
}

export interface DeployRequest {
  contractSource: string;
  contractName: string;
  frontendFiles?: GeneratedFile[];
  appSlug?: string;
}

export interface DeployResult {
  success: boolean;
  contractAddress?: string;
  transactionHash?: string;
  explorerUrl?: string;
  abi?: unknown[];
  error?: string;
  frontendUrl?: string;
  vercelDeploymentId?: string;
  frontendError?: string;
}

export type BuilderPhase = "idle" | "interviewing" | "generating" | "generated" | "deploying" | "deployed";

export interface BuilderState {
  phase: BuilderPhase;
  prompt: string;
  interviewSummary: string | null;
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
