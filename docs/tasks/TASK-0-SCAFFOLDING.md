# Task 0: Project Scaffolding + Shared Types

**Priority**: BLOCKS ALL OTHER TASKS — must complete first
**Estimated time**: ~15 minutes
**Dependencies**: None

## Objective

Set up the Next.js project, install all dependencies, initialize shadcn/ui, and create the shared types and constants files that all other tasks depend on.

## Steps

### 1. Create Next.js App

```bash
cd /Users/ppz/Developer/projects/polar
pnpm create next-app@latest . --ts --tailwind --app --src-dir --eslint --import-alias "@/*" --use-pnpm
```

If the directory isn't empty, it may prompt — accept overwriting. The `.claude` folder and `docs/` should be preserved.

### 2. Install Dependencies

```bash
pnpm add @anthropic-ai/sdk solc ethers @codesandbox/sandpack-react lucide-react
```

### 3. Initialize shadcn/ui

```bash
pnpm dlx shadcn@latest init
```

When prompted:
- Style: Default
- Base color: Neutral (or Slate)
- CSS variables: Yes

Then add required components:

```bash
pnpm dlx shadcn@latest add button card input textarea badge tabs scroll-area skeleton dialog separator
```

### 4. Create `.env.local.example`

```
ANTHROPIC_API_KEY=sk-ant-...
DEPLOYER_PRIVATE_KEY=0x...
NEXT_PUBLIC_FUJI_RPC=https://api.avax-test.network/ext/bc/C/rpc
NEXT_PUBLIC_CHAIN_ID=43113
NEXT_PUBLIC_EXPLORER_URL=https://testnet.snowtrace.io
```

### 5. Create Shared Types (`src/lib/types.ts`)

Copy the exact types from `docs/TYPES.md`. This is the canonical type file — do not modify the types.

### 6. Create Constants (`src/lib/constants.ts`)

```typescript
export const FUJI_CHAIN_CONFIG = {
  chainId: 43113,
  chainName: "Avalanche Fuji Testnet",
  rpcUrl: process.env.NEXT_PUBLIC_FUJI_RPC || "https://api.avax-test.network/ext/bc/C/rpc",
  explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL || "https://testnet.snowtrace.io",
  nativeCurrency: {
    name: "AVAX",
    symbol: "AVAX",
    decimals: 18,
  },
};

export const TEMPLATE_SUMMARIES: Record<string, { name: string; description: string; icon: string }> = {
  token: {
    name: "Token (ERC-20)",
    description: "Fungible token with customizable name, symbol, and supply",
    icon: "Coins",
  },
  nft: {
    name: "NFT Collection (ERC-721)",
    description: "Non-fungible token collection with metadata and minting",
    icon: "Image",
  },
  game: {
    name: "On-Chain Game",
    description: "Simple betting/lottery game with entry fees and prizes",
    icon: "Gamepad2",
  },
  tipping: {
    name: "Tipping / Payments",
    description: "Accept tips and payments with optional fee splitting",
    icon: "Heart",
  },
};

export const SUGGESTED_PROMPTS = [
  { label: "Loyalty Token", prompt: "Create a loyalty token called CafePoints for my coffee shop with 1 million initial supply" },
  { label: "NFT Collection", prompt: "Create an NFT collection called PixelPals for digital art with a max supply of 100" },
  { label: "Betting Game", prompt: "Create a coin flip betting game where players can wager AVAX" },
  { label: "Tipping Page", prompt: "Create a tipping page for my podcast where fans can send tips" },
];
```

### 7. Set Up Global CSS (`src/app/globals.css`)

Keep Tailwind defaults but ensure the color scheme is set up for the light, clean aesthetic described in `docs/ARCHITECTURE.md`. Use the shadcn/ui CSS variables that were initialized.

### 8. Set Up Root Layout (`src/app/layout.tsx`)

- Use Inter font from `next/font/google`
- Set metadata: title "Polar — Build Web3 Apps on Avalanche", description accordingly
- Minimal layout wrapper

### 9. Update `.gitignore`

Ensure it includes:
```
.env.local
.env*.local
node_modules/
.next/
```

## Verification

- `pnpm dev` starts without errors
- `localhost:3000` renders the default Next.js page (will be replaced by Task 1)
- All shadcn/ui components are available in `src/components/ui/`
- `src/lib/types.ts` and `src/lib/constants.ts` exist and compile

## Output Files

- `package.json` (with all deps)
- `next.config.ts`
- `tailwind.config.ts`
- `tsconfig.json`
- `postcss.config.mjs`
- `.gitignore`
- `.env.local.example`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/lib/types.ts`
- `src/lib/constants.ts`
- `src/components/ui/` (shadcn components)
