import solc from "solc";

export interface CompileResult {
  success: boolean;
  abi?: unknown[];
  bytecode?: string;
  errors?: string[];
}

interface SolcDiagnostic {
  severity: string;
  formattedMessage: string;
}

interface SolcContractOutput {
  abi: unknown[];
  evm?: {
    bytecode?: {
      object?: string;
    };
  };
}

interface SolcOutput {
  errors?: SolcDiagnostic[];
  contracts?: Record<string, Record<string, SolcContractOutput>>;
}

interface SolcCompiler {
  compile(input: string): string;
}

export function compileContract(source: string, contractName: string): CompileResult {
  try {
    const input = {
      language: "Solidity",
      sources: {
        [`${contractName}.sol`]: { content: source },
      },
      settings: {
        outputSelection: {
          "*": {
            "*": ["abi", "evm.bytecode.object"],
          },
        },
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    };

    const compiler = solc as unknown as SolcCompiler;
    const raw = compiler.compile(JSON.stringify(input));
    const output = JSON.parse(raw) as SolcOutput;

    const errors = ((output.errors as SolcDiagnostic[] | undefined) ?? []).filter(
      (error) => error.severity === "error",
    );

    if (errors.length > 0) {
      return {
        success: false,
        errors: errors.map((error) => error.formattedMessage),
      };
    }

    const fileOutput = output.contracts?.[`${contractName}.sol`];
    if (!fileOutput) {
      return { success: false, errors: ["Contract source output not found"] };
    }

    const contractOutput = fileOutput[contractName] ?? Object.values(fileOutput)[0];

    if (!contractOutput?.evm?.bytecode?.object) {
      return { success: false, errors: ["Compiled bytecode is missing"] };
    }

    return {
      success: true,
      abi: contractOutput.abi,
      bytecode: `0x${contractOutput.evm.bytecode.object}`,
    };
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : "Unknown compiler error"],
    };
  }
}
