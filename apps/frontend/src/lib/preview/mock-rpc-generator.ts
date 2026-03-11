import { ContractCategory } from "@/lib/types";
import { contractTemplates } from "@/lib/contracts/templates";

export const MOCK_CONTRACT_ADDRESS = "0x1234567890abcdef1234567890abcdef12345678";
const MOCK_OWNER_ADDRESS = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd";

/**
 * Generates TypeScript source for a `/mock-rpc.ts` Sandpack file.
 * The module intercepts JSON-RPC calls so wagmi hooks return realistic data
 * without a deployed contract.
 */
export function generateMockRpcSource(
  templateId: ContractCategory,
  contractParams: Record<string, string>,
): string {
  const template = contractTemplates[templateId];
  const abiJson = JSON.stringify(template.abi, null, 2);
  const mockEntries = buildMockEntries(templateId, contractParams);

  return `import { decodeFunctionData, encodeFunctionResult } from "viem";

const abi = ${abiJson} as const;

const mockValues: Record<string, unknown> = {
${mockEntries}
};

export async function handleRequest({ method, params }: { method: string; params?: unknown[] }): Promise<unknown> {
  switch (method) {
    case "eth_chainId":
      return "0xa869"; // Avalanche Fuji (43113)

    case "eth_getBalance":
      return "0x8AC7230489E80000"; // 10 AVAX

    case "eth_blockNumber":
      return "0x1000000";

    case "eth_estimateGas":
      return "0x5208";

    case "eth_gasPrice":
      return "0x6FC23AC00"; // 30 gwei

    case "eth_sendTransaction":
    case "eth_sendRawTransaction":
      return "0x" + "a".repeat(64);

    case "eth_getTransactionReceipt":
      return {
        transactionHash: (params?.[0] as string) || "0x" + "a".repeat(64),
        blockHash: "0x" + "b".repeat(64),
        blockNumber: "0x1000000",
        contractAddress: null,
        cumulativeGasUsed: "0x5208",
        gasUsed: "0x5208",
        status: "0x1",
        logs: [],
      };

    case "eth_call": {
      if (!params?.[0]) return "0x";
      const tx = params[0] as { data?: string };
      if (!tx.data) return "0x";

      try {
        const { functionName } = decodeFunctionData({ abi, data: tx.data as any });
        const mockValue = mockValues[functionName];
        if (mockValue === undefined) return "0x";

        const abiItem = abi.find(
          (item: any) => item.type === "function" && item.name === functionName,
        );
        if (!abiItem) return "0x";

        return encodeFunctionResult({ abi: [abiItem] as any, functionName, result: mockValue as any });
      } catch {
        return "0x";
      }
    }

    default:
      return null;
  }
}
`;
}

function buildMockEntries(
  templateId: ContractCategory,
  params: Record<string, string>,
): string {
  const entries: [string, string][] = [];

  switch (templateId) {
    case "token": {
      const name = params["{{TOKEN_NAME}}"] || "MyToken";
      const symbol = params["{{TOKEN_SYMBOL}}"] || "MTK";
      const supply = params["{{INITIAL_SUPPLY}}"] || "1000000";
      entries.push(
        ["name", JSON.stringify(name)],
        ["symbol", JSON.stringify(symbol)],
        ["decimals", "18"],
        ["totalSupply", `BigInt("${supply}") * 10n ** 18n`],
        ["balanceOf", `BigInt("${supply}") * 10n ** 18n`],
        ["allowance", "0n"],
      );
      break;
    }
    case "nft": {
      const name = params["{{NFT_NAME}}"] || "PixelPals";
      const symbol = params["{{NFT_SYMBOL}}"] || "PXP";
      const maxSupply = params["{{MAX_SUPPLY}}"] || "100";
      entries.push(
        ["name", JSON.stringify(name)],
        ["symbol", JSON.stringify(symbol)],
        ["totalSupply", "3n"],
        ["maxSupply", `BigInt("${maxSupply}")`],
        ["balanceOf", "3n"],
        ["ownerOf", `"${MOCK_OWNER_ADDRESS}"`],
      );
      break;
    }
    case "game": {
      const gameName = params["{{GAME_NAME}}"] || "CoinFlip";
      const entryFee = params["{{ENTRY_FEE}}"] || "100000000000000000";
      const maxPlayers = params["{{MAX_PLAYERS}}"] || "10";
      entries.push(
        ["gameName", JSON.stringify(gameName)],
        ["entryFee", `BigInt("${entryFee}")`],
        ["maxPlayers", `BigInt("${maxPlayers}")`],
        ["getPlayers", "[]"],
        ["getBalance", "0n"],
      );
      break;
    }
    case "tipping": {
      const appName = params["{{APP_NAME}}"] || "TipJar";
      const feePercentage = params["{{FEE_PERCENTAGE}}"] || "5";
      entries.push(
        ["appName", JSON.stringify(appName)],
        ["owner", `"${MOCK_OWNER_ADDRESS}"`],
        ["feePercentage", `BigInt("${feePercentage}")`],
        ["getTips", "[]"],
        ["getBalance", "0n"],
      );
      break;
    }
  }

  return entries.map(([key, value]) => `  ${key}: ${value},`).join("\n");
}
