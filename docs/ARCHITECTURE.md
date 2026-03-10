# Polar — Architecture Overview

## What is Polar?

Polar is an AI-native builder for Avalanche web3 apps. Non-technical users describe what they want in natural language; Polar generates frontend code + parameterized smart contracts, renders a live preview, and deploys to Avalanche Fuji testnet.

**Key insight**: Rather than generating arbitrary Solidity (dangerous), Claude selects from vetted templates and parameterizes them. This is safer, faster, and more reliable.

## System Flow

```
User Prompt → /api/generate (Claude API) → template selection + parameterization + React code gen
                                         → returns GenerationResult

GenerationResult → Sandpack preview (in-browser) + Code viewer (tabs)
                → User clicks "Deploy to Avalanche"
                → /api/deploy → solc-js compile → ethers.js deploy to Fuji
                → returns contract address + explorer link
```

**Server-side wallet**: Pre-funded Fuji wallet deploys on user's behalf. Users never see wallets/gas.

## Tech Stack

- **Framework**: Next.js 14+ (App Router, TypeScript), `pnpm` as package manager
- **Styling**: Tailwind CSS + shadcn/ui
- **AI**: Claude API (`@anthropic-ai/sdk`) for generation
- **Contracts**: `solc` (solc-js) for Solidity compilation (server-side, Node.js runtime)
- **Blockchain**: `ethers` v6 for Fuji deployment
- **Preview**: `@codesandbox/sandpack-react` for live preview
- **Icons**: `lucide-react`
- **Hosting**: Vercel (deploy from GitHub)

## Directory Structure (target)

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Dashboard / landing
│   ├── globals.css             # Global styles
│   ├── app/[id]/
│   │   └── page.tsx            # Builder page (3-column)
│   └── api/
│       ├── generate/route.ts   # AI generation endpoint
│       └── deploy/route.ts     # Contract deploy endpoint
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   ├── shared/
│   │   ├── navbar.tsx
│   │   └── logo.tsx
│   ├── landing/
│   │   ├── hero-prompt.tsx
│   │   ├── template-grid.tsx
│   │   ├── template-card.tsx
│   │   └── footer.tsx
│   └── builder/
│       ├── chat-panel.tsx
│       ├── prompt-input.tsx
│       ├── preview-panel.tsx
│       ├── code-viewer.tsx
│       ├── deploy-button.tsx
│       ├── deploy-result.tsx
│       └── generation-status.tsx
├── hooks/
│   ├── use-generation.ts
│   └── use-deploy.ts
└── lib/
    ├── types.ts                # All shared types
    ├── constants.ts            # Chain config, explorer URLs
    ├── contracts/
    │   ├── templates/
    │   │   ├── token.sol
    │   │   ├── nft.sol
    │   │   ├── game.sol
    │   │   ├── tipping.sol
    │   │   └── index.ts        # Template registry
    │   ├── compiler.ts         # solc-js wrapper
    │   └── deployer.ts         # ethers.js deploy wrapper
    ├── ai/
    │   ├── prompt-builder.ts   # System prompt construction
    │   └── response-parser.ts  # Parse Claude's structured output
    ├── preview/
    │   ├── sandpack-config.ts  # Sandpack theme + deps
    │   └── template-files.ts   # Base Sandpack files
    └── templates/
        └── community.ts        # Hardcoded community templates
```

## Environment Variables

```
ANTHROPIC_API_KEY=sk-ant-...
DEPLOYER_PRIVATE_KEY=0x...        # Pre-funded Fuji testnet wallet
NEXT_PUBLIC_FUJI_RPC=https://api.avax-test.network/ext/bc/C/rpc
NEXT_PUBLIC_CHAIN_ID=43113
NEXT_PUBLIC_EXPLORER_URL=https://testnet.snowtrace.io
```

## Design Direction

- **Light + clean** aesthetic — white backgrounds, clean sans-serif typography
- Minimal UI chrome, lots of whitespace
- Avalanche red (#E84142) as accent for primary CTAs only
- Subtle gray borders, rounded corners, soft shadows
- Proper typography scale (modular scale, not arbitrary sizes)
- Tinted neutrals (not pure gray) — warm or cool tinted to match accent
- Inter or system font stack
- Dashboard layout mirrors Hercules: centered prompt, suggested chips below, template grid below that

## What's Real vs. Mocked

| Component | Status |
|-----------|--------|
| Dashboard + landing page | Real |
| Community templates | Hardcoded (visual only, clicking pre-fills prompt) |
| AI generation (Claude) | Real |
| Template selection + parameterization | Real |
| Frontend code generation | Real |
| Sandpack preview | Real |
| Solidity compilation (solc-js) | Real |
| Fuji deployment | Real |
| Contract interaction in preview | Mocked (simulated data) |
| Chat iteration (follow-up prompts) | Real (stateless — each generation is fresh) |
| Kite integration | Branded only ("coming soon") |
| User auth / accounts | None for MVP |
| App persistence / database | None — state in React only |
