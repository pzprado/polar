# Polar

**AI-native builder for decentralized applications on Avalanche.**

Describe your app in plain English. Polar generates the frontend, selects and parameterizes a vetted smart contract, renders a live preview — and deploys it to Avalanche Fuji with one click.

No wallets. No Solidity. No DevOps. Just ship.

---

## The Problem

Building on-chain applications today requires knowing Solidity, frontend frameworks, wallet integrations, deployment tooling, and gas management. This keeps 99% of builders out.

## Our Solution

Polar removes every barrier between an idea and a live dApp:

1. **Describe** — Type what you want in plain English ("a loyalty token for my coffee shop")
2. **Generate** — Claude selects from vetted Solidity templates, parameterizes them for your use case, and generates a React frontend wired to the contract's ABI
3. **Preview** — See your app running live in-browser via Sandpack, before anything touches the chain
4. **Deploy** — One click compiles with solc and deploys to Avalanche Fuji. You get a contract address and Snowtrace link in seconds

## Architecture

```
User Prompt
    │
    ▼
/api/generate (Claude API)
    ├── Template selection (token / nft / game / tipping)
    ├── Parameter extraction (name, symbol, supply, etc.)
    ├── Solidity source filled from vetted templates
    └── React component generated with ethers.js bindings
    │
    ▼
Builder UI
    ├── Live preview (Sandpack in-browser sandbox)
    ├── Frontend code viewer
    └── Smart contract source viewer
    │
    ▼
/api/deploy
    ├── solc-js compilation (server-side, Node.js runtime)
    ├── ethers.js deployment to Avalanche Fuji
    └── Returns contract address + Snowtrace explorer link
```

**Key design decision:** Rather than generating arbitrary Solidity (dangerous and unreliable), Claude selects from 4 pre-audited templates and parameterizes them. This is safer, faster, and deterministic.

## Smart Contract Templates

| Template | Parameters | Use Case |
|---|---|---|
| **ERC-20 Token** | name, symbol, initial supply | Loyalty points, governance tokens, in-game currency |
| **ERC-721 NFT** | name, symbol, max supply, base URI | Collectibles, game items, membership passes |
| **Game** | name, entry fee, max players | Coin flip, lottery, prediction games |
| **Tipping** | app name, fee percentage | Creator payments, donations, tips |

All templates are self-contained Solidity (no external imports) and compile cleanly with solc 0.8.x.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, React 19, TypeScript) |
| Styling | Tailwind CSS v4, shadcn/ui, Motion (framer-motion) |
| AI | Claude API (`@anthropic-ai/sdk`) with Ollama/Kimi K2.5 fallback |
| Contracts | solc-js (in-browser Solidity compiler) |
| Deployment | ethers.js v6 → Avalanche Fuji C-Chain |
| Preview | Sandpack (CodeSandbox in-browser bundler) |
| Hosting | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Setup

```bash
# Clone the repo
git clone https://github.com/paoloanzn/polar.git
cd polar/apps/frontend

# Install dependencies
pnpm install

# Configure environment
cp .env.local.example .env.local
# Fill in:
#   ANTHROPIC_API_KEY    — your Claude API key
#   DEPLOYER_PRIVATE_KEY — a Fuji testnet wallet private key (fund via faucet)
```

### Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Fund the deployer wallet

Get free AVAX from the [Avalanche Fuji Faucet](https://faucet.avax.network/) using the deployer wallet address.

## Project Structure

```
apps/frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page
│   │   ├── app/[id]/page.tsx           # Builder (chat + preview + code)
│   │   └── api/
│   │       ├── generate/route.ts       # Claude AI generation endpoint
│   │       └── deploy/route.ts         # Solidity compile + Fuji deploy
│   ├── components/
│   │   ├── builder/                    # Chat panel, preview, code viewer, deploy
│   │   └── shared/                     # Logo
│   ├── hooks/
│   │   ├── use-generation.ts           # Generation state machine
│   │   └── use-deploy.ts              # Deploy state + API calls
│   └── lib/
│       ├── ai/                         # Prompt builder, response parser
│       ├── contracts/                  # Solidity templates, compiler, deployer
│       ├── preview/                    # Sandpack config + template files
│       ├── types.ts                    # Shared TypeScript types
│       └── constants.ts               # Chain config, suggested prompts
```

## How the AI Pipeline Works

1. User prompt hits `/api/generate`
2. System prompt includes all 4 template definitions (id, params, ABI) + React generation instructions
3. Claude selects the best-fit template and extracts parameters from natural language
4. Server fills Solidity placeholders (never trusting AI to write raw Solidity)
5. Claude generates a self-contained React component using ethers.js, wired to the contract's ABI
6. Result returned: filled contract source + React frontend + explanation

The AI pipeline supports **Ollama with Kimi K2.5 as a fallback** when the Anthropic API is unavailable.

## Deployment Flow

1. User clicks "Deploy to Avalanche"
2. Server compiles Solidity source with solc-js (WASM, runs in Node.js runtime)
3. Server deploys bytecode to Fuji via ethers.js using the pre-funded deployer wallet
4. Contract address and transaction hash returned to client
5. Explorer link points to Snowtrace testnet

## What's Live vs. Planned

| Component | Status |
|---|---|
| Landing page | Live |
| AI generation (Claude + Ollama fallback) | Live |
| Template selection + parameterization | Live |
| Frontend code generation | Live |
| In-browser Sandpack preview | Live |
| Solidity compilation (solc-js) | Live |
| Fuji testnet deployment | Live |
| Passkey wallet (user-owned contracts) | Planned — Thirdweb integration |
| Contract interaction in preview | Simulated |
| Iterative chat refinement | Live (stateless per generation) |
| User accounts / persistence | Planned |
| Kite AI payments integration | Planned |

## Hackathon

Built for [Build Games 2026](https://build.avax.network/build-games) on Avalanche.

## License

MIT
