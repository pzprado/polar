# Task 2: Smart Contract Templates + Compiler + Deployer

**Priority**: Can run in parallel after Task 0 completes
**Estimated time**: ~30 minutes
**Dependencies**: Task 0 (types)
**Parallel with**: Tasks 1, 3, 4, 5
**Blocks**: Task 5 (deploy API route imports compiler.ts and deployer.ts)

## Objective

Create 4 self-contained Solidity smart contract templates, a solc-js compiler wrapper, an ethers.js deployer, and a template registry. These are the core backend pieces that power contract compilation and deployment.

## Files to Create

| File | Purpose |
|------|---------|
| `src/lib/contracts/templates/token.sol` | ERC-20 template with placeholders |
| `src/lib/contracts/templates/nft.sol` | ERC-721 template with placeholders |
| `src/lib/contracts/templates/game.sol` | Coin-flip/lottery game template |
| `src/lib/contracts/templates/tipping.sol` | Tipping/payments template |
| `src/lib/contracts/templates/index.ts` | Template registry mapping |
| `src/lib/contracts/compiler.ts` | solc-js compilation wrapper |
| `src/lib/contracts/deployer.ts` | ethers.js deployment wrapper |

## Critical Constraints

1. **Templates must be self-contained** — NO import statements (no `@openzeppelin`). Inline all interfaces (IERC20, IERC721, etc.) directly in the .sol files.
2. **Must compile with solc 0.8.x** — use `pragma solidity ^0.8.20;`
3. **Placeholders use `{{DOUBLE_CURLY}}` format** — these get string-replaced server-side before compilation
4. **Constructor parameters must match what the AI pipeline extracts** — coordinate with types in `docs/TYPES.md`
5. **Each template's ABI is pre-computed** — compile once during development, store the ABI in the registry

## Solidity Templates

### `token.sol` — ERC-20 Token
Parameters: `{{TOKEN_NAME}}`, `{{TOKEN_SYMBOL}}`, `{{INITIAL_SUPPLY}}`

Implement a minimal ERC-20 with:
- Inline IERC20 interface
- `name()`, `symbol()`, `decimals()`, `totalSupply()`, `balanceOf()`, `transfer()`, `approve()`, `allowance()`, `transferFrom()`
- Constructor mints `{{INITIAL_SUPPLY}} * 10**18` to `msg.sender`
- Events: `Transfer`, `Approval`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract {{TOKEN_NAME}} {
    string public name = "{{TOKEN_NAME}}";
    string public symbol = "{{TOKEN_SYMBOL}}";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() {
        totalSupply = {{INITIAL_SUPPLY}} * 10 ** uint256(decimals);
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    function transfer(address to, uint256 value) public returns (bool) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) public returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Insufficient allowance");
        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;
        emit Transfer(from, to, value);
        return true;
    }
}
```

### `nft.sol` — ERC-721 NFT
Parameters: `{{NFT_NAME}}`, `{{NFT_SYMBOL}}`, `{{MAX_SUPPLY}}`, `{{BASE_URI}}`

Implement a minimal ERC-721 with:
- `balanceOf()`, `ownerOf()`, `transferFrom()`, `approve()`, `mint()`
- `tokenURI()` returning `baseURI + tokenId`
- Max supply cap
- Only owner can mint (set in constructor)
- `totalSupply` counter

### `game.sol` — Coin Flip / Lottery Game
Parameters: `{{GAME_NAME}}`, `{{ENTRY_FEE}}`, `{{MAX_PLAYERS}}`

Implement:
- Players join by sending entry fee (in wei)
- Max player cap per round
- Simple pseudo-random winner selection (block.timestamp based — fine for testnet)
- Winner gets the pot (minus optional small fee)
- `join()`, `pickWinner()`, `getPlayers()`
- Events: `PlayerJoined`, `WinnerPicked`

### `tipping.sol` — Tipping / Payments
Parameters: `{{APP_NAME}}`, `{{FEE_PERCENTAGE}}`

Implement:
- `tip(string message)` payable function
- Owner receives tips (minus fee percentage)
- Fee goes to contract (withdrawable by owner)
- `getTips()` returns tip history
- `withdraw()` for owner
- Events: `TipReceived`, `Withdrawn`

## Template Registry (`src/lib/contracts/templates/index.ts`)

```typescript
import { ContractTemplate, ContractCategory } from "@/lib/types";

// Import .sol files as raw strings
// In Next.js, you may need to read them at build time or inline them as template literals

export const contractTemplates: Record<ContractCategory, ContractTemplate> = {
  token: {
    id: "token",
    name: "ERC-20 Token",
    description: "A fungible token with customizable name, symbol, and initial supply",
    soliditySource: `...`, // The full .sol content as a string with {{PLACEHOLDERS}}
    parameters: [
      { name: "Token Name", placeholder: "{{TOKEN_NAME}}", type: "string", description: "Name of the token", defaultValue: "MyToken" },
      { name: "Token Symbol", placeholder: "{{TOKEN_SYMBOL}}", type: "string", description: "Short symbol (3-5 chars)", defaultValue: "MTK" },
      { name: "Initial Supply", placeholder: "{{INITIAL_SUPPLY}}", type: "number", description: "Number of tokens to mint", defaultValue: "1000000" },
    ],
    abi: [ /* pre-computed ABI array */ ],
  },
  nft: { /* ... */ },
  game: { /* ... */ },
  tipping: { /* ... */ },
};

/**
 * Fill a template's placeholders with actual values.
 * Returns compiled-ready Solidity source.
 */
export function fillTemplate(templateId: ContractCategory, params: Record<string, string>): string {
  const template = contractTemplates[templateId];
  let source = template.soliditySource;
  for (const param of template.parameters) {
    const value = params[param.placeholder] || param.defaultValue || "";
    source = source.replaceAll(param.placeholder, value);
  }
  return source;
}
```

**Important**: Since Next.js can't import .sol files directly, you have two options:
1. **Inline the Solidity as template literal strings** in the index.ts file (recommended for MVP)
2. Use `fs.readFileSync` at module load time (only works server-side)

**Recommendation**: Go with option 1 — inline the Solidity source as template literals in `index.ts`. Still create the `.sol` files for reference/documentation, but the actual runtime source comes from the strings in `index.ts`.

## Compiler (`src/lib/contracts/compiler.ts`)

```typescript
import solc from "solc";

export interface CompileResult {
  success: boolean;
  abi?: any[];
  bytecode?: string;
  errors?: string[];
}

export function compileContract(source: string, contractName: string): CompileResult {
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

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  // Check for errors (not warnings)
  const errors = output.errors?.filter((e: any) => e.severity === "error") || [];
  if (errors.length > 0) {
    return {
      success: false,
      errors: errors.map((e: any) => e.formattedMessage),
    };
  }

  const contract = output.contracts[`${contractName}.sol`][contractName];
  if (!contract) {
    // Try to find the contract by checking all contract names in the output
    const allContracts = output.contracts[`${contractName}.sol`];
    const firstContract = Object.values(allContracts)[0] as any;
    if (firstContract) {
      return {
        success: true,
        abi: firstContract.abi,
        bytecode: "0x" + firstContract.evm.bytecode.object,
      };
    }
    return { success: false, errors: ["Contract not found in compilation output"] };
  }

  return {
    success: true,
    abi: contract.abi,
    bytecode: "0x" + contract.evm.bytecode.object,
  };
}
```

**Note on solc import**: The `solc` npm package provides a JavaScript wrapper. The import may need adjustment depending on the exact version. Test with `const solc = require("solc")` if the ES module import doesn't work. You may need to add `// @ts-ignore` or type declarations.

## Deployer (`src/lib/contracts/deployer.ts`)

```typescript
import { ethers } from "ethers";
import { DeployResult } from "@/lib/types";
import { FUJI_CHAIN_CONFIG } from "@/lib/constants";

export async function deployContract(
  abi: any[],
  bytecode: string,
  constructorArgs: any[] = []
): Promise<DeployResult> {
  try {
    const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
    if (!privateKey) {
      return { success: false, error: "Deployer private key not configured" };
    }

    const provider = new ethers.JsonRpcProvider(FUJI_CHAIN_CONFIG.rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    // Check balance
    const balance = await provider.getBalance(wallet.address);
    if (balance === 0n) {
      return { success: false, error: "Deployer wallet has no AVAX. Fund it from the Fuji faucet." };
    }

    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const contract = await factory.deploy(...constructorArgs);
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    const deployTx = contract.deploymentTransaction();

    return {
      success: true,
      contractAddress: address,
      transactionHash: deployTx?.hash,
      explorerUrl: `${FUJI_CHAIN_CONFIG.explorerUrl}/address/${address}`,
      abi,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Deployment failed",
    };
  }
}
```

## Pre-Computing ABIs

To get the ABI for each template without needing to compile at runtime just for the ABI:

1. Write each .sol template with placeholder values replaced by valid defaults
2. Compile with solc
3. Extract the ABI array
4. Hardcode it into the template registry

You can do this by writing a small script, or by compiling once and copy-pasting the ABI. The ABI doesn't change as long as the function signatures don't change.

## Verification

1. Import `contractTemplates` from the registry — all 4 templates are present
2. `fillTemplate("token", { "{{TOKEN_NAME}}": "TestToken", "{{TOKEN_SYMBOL}}": "TST", "{{INITIAL_SUPPLY}}": "1000000" })` returns valid Solidity
3. `compileContract(filledSource, "TestToken")` returns `{ success: true, abi: [...], bytecode: "0x..." }`
4. All 4 templates compile successfully with default values
5. `deployer.ts` exports correctly (can't fully test without Fuji key, but types should compile)

## Notes

- The `solc` npm package bundles a WASM compiler — it's ~8MB but works fine in Node.js serverless
- Constructor args for all current templates are empty (params are hardcoded in the source) — but the deployer supports them for future use
- The compiler function should be called server-side only (`runtime = 'nodejs'` in the API route)
