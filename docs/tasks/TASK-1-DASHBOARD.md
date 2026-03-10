# Task 1: Dashboard + Landing Page

**Priority**: Can run in parallel after Task 0 completes
**Estimated time**: ~30 minutes
**Dependencies**: Task 0 (scaffolding, types, constants, shadcn/ui components)
**Parallel with**: Tasks 2, 3, 4, 5

## Objective

Build the main landing page / dashboard at `/` that mirrors the Hercules.app dashboard pattern: centered prompt, suggested chips, and a community template grid with category filtering.

## Files to Create

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Combined landing + dashboard page |
| `src/components/shared/navbar.tsx` | Top navigation bar |
| `src/components/shared/logo.tsx` | Polar logo/wordmark |
| `src/components/landing/hero-prompt.tsx` | Hero heading + prompt input + chips |
| `src/components/landing/template-grid.tsx` | Community templates grid with category tabs |
| `src/components/landing/template-card.tsx` | Individual template card |
| `src/components/landing/footer.tsx` | Footer with Avalanche + Kite branding |
| `src/lib/templates/community.ts` | Hardcoded community template data |

## Layout Spec

```
┌──────────────────────────────────────────────────────────┐
│  Polar (logo)                              [Start Building] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│           What can Polar build for you?                  │
│                                                          │
│   ┌──────────────────────────────────────────────┐      │
│   │ Describe your web3 app on Avalanche...        │      │
│   │                                    [Build ->] │      │
│   └──────────────────────────────────────────────┘      │
│                                                          │
│   Try one →  Loyalty Token   NFT Collection   Game       │
│                                                          │
│   ─── From the Community ──────────────────────────      │
│   All  Games  Tokens  NFTs  Payments                      │
│                                                          │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│   │ Coin    │ │ NFT     │ │ Rewards │ │ Tipping │      │
│   │ Flip    │ │ Gallery │ │ Token   │ │ Page    │      │
│   │  Games  │ │  NFTs   │ │  Tokens │ │Payments │      │
│   └─────────┘ └─────────┘ └─────────┘ └─────────┘      │
│                                                          │
│   ─── Built on Avalanche · Powered by Kite ────────      │
└──────────────────────────────────────────────────────────┘
```

## Component Details

### `src/components/shared/logo.tsx`
- Mountain/ice themed wordmark: "Polar" text with a small mountain icon (use `Mountain` from lucide-react)
- Simple, clean, no excessive decoration

### `src/components/shared/navbar.tsx`
- Fixed top bar, white background, subtle bottom border
- Left: `<Logo />`
- Right: "Start Building" button (Avalanche red `#E84142`, links to `#prompt` anchor or scrolls to prompt)
- Max-width container centered

### `src/components/landing/hero-prompt.tsx`
- Large heading: "What can **Polar** build for you?" (bold on "Polar")
- Subheading: "Describe your app in plain English. We'll generate the code and deploy it to Avalanche."
- Textarea with placeholder "Describe your web3 app on Avalanche..."
  - Rounded, subtle border, generous padding
  - "Build" button integrated at bottom-right of textarea (or below)
  - Button: Avalanche red background, white text, arrow icon
- Below textarea: "Try one →" followed by suggested prompt chips
  - Chips are outlined/ghost buttons with rounded-full styling
  - Import `SUGGESTED_PROMPTS` from `@/lib/constants`
  - Clicking a chip fills the textarea with the prompt text
- On submit (button click or Enter): redirect to `/app/new?prompt={encodeURIComponent(prompt)}`

### `src/components/landing/template-grid.tsx`
- Section heading: "From the Community" with a subtle horizontal rule
- Category tabs/filters: "All", "Games", "Tokens", "NFTs", "Payments"
  - Use simple text buttons or shadcn Tabs component
  - Active tab has underline or background highlight
- Grid of `<TemplateCard />` components (4 columns on desktop, 2 on mobile)
- Filter cards by selected category

### `src/components/landing/template-card.tsx`
- Props: `CommunityTemplate` from types
- Card with subtle border, rounded corners, hover shadow transition
- Category badge (top-right or top, using shadcn Badge)
- Title (bold)
- Short description (muted text)
- On click: redirect to `/app/new?prompt={encodeURIComponent(template.prompt)}`
- Cursor pointer, subtle scale on hover

### `src/components/landing/footer.tsx`
- Muted text, centered
- "Built on Avalanche" with Avalanche logo or red dot
- "Powered by Kite" mention
- "Build Games 2026 Hackathon" small text
- Subtle top border

### `src/lib/templates/community.ts`
Hardcoded array of `CommunityTemplate` objects:

```typescript
import { CommunityTemplate } from "@/lib/types";

export const communityTemplates: CommunityTemplate[] = [
  {
    id: "coin-flip",
    title: "Coin Flip",
    description: "A simple heads-or-tails betting game where players wager AVAX",
    category: "game",
    prompt: "Create a coin flip betting game where players can wager AVAX with a 50/50 chance of doubling their bet",
  },
  {
    id: "nft-gallery",
    title: "NFT Gallery",
    description: "Mint and showcase a collection of unique digital artworks",
    category: "nft",
    prompt: "Create an NFT collection called ArtVault for digital art with a max supply of 50 and a mint price of 0.1 AVAX",
  },
  {
    id: "rewards-token",
    title: "Rewards Token",
    description: "Launch a loyalty or rewards token for your community",
    category: "token",
    prompt: "Create a rewards token called StarPoints with 500,000 initial supply for a community loyalty program",
  },
  {
    id: "tip-jar",
    title: "Tip Jar",
    description: "Accept crypto tips from fans and supporters",
    category: "tipping",
    prompt: "Create a tipping page for my music channel where fans can send AVAX tips with optional messages",
  },
  {
    id: "lottery",
    title: "Mini Lottery",
    description: "A lottery game where players buy tickets for a chance to win the pot",
    category: "game",
    prompt: "Create a lottery game where players buy tickets for 0.05 AVAX and one random winner takes the pot",
  },
  {
    id: "membership-nft",
    title: "Membership Pass",
    description: "NFT-based membership passes for exclusive access",
    category: "nft",
    prompt: "Create an NFT membership pass collection called VIPPass with 200 max supply for exclusive community access",
  },
];
```

### `src/app/page.tsx`
- Compose: `<Navbar />`, `<HeroPrompt />`, `<TemplateGrid />`, `<Footer />`
- Clean spacing between sections (py-16 or similar)
- Max-width container (max-w-5xl or max-w-6xl mx-auto)

## Design Requirements

- **Light theme only** — white backgrounds, no dark mode needed for MVP
- Avalanche red `#E84142` for primary CTAs only (Build button, Start Building button)
- All other elements: neutral grays with subtle warm/cool tint
- Typography: Inter font (set up in Task 0's layout.tsx)
- Generous whitespace, no visual clutter
- Cards: `rounded-lg` or `rounded-xl`, subtle `border`, `shadow-sm` on hover
- Responsive: stack to 1-2 columns on mobile, 3-4 on desktop

## Imports You'll Need

```typescript
// From constants (Task 0)
import { SUGGESTED_PROMPTS } from "@/lib/constants";

// From types (Task 0)
import { CommunityTemplate, ContractCategory } from "@/lib/types";

// From shadcn/ui (Task 0)
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

// From lucide-react
import { ArrowRight, Mountain, Coins, Image, Gamepad2, Heart } from "lucide-react";

// From next
import { useRouter } from "next/navigation";
```

## Routing

- Submit prompt → `router.push(\`/app/new?prompt=\${encodeURIComponent(prompt)}\`)`
- Click template card → same routing with the template's prompt
- The `/app/[id]` page (Task 6) will read this query param

## Verification

- `pnpm dev` → navigate to `/`
- See the full dashboard: navbar, hero, prompt input, chips, template grid, footer
- Clicking a chip fills the textarea
- Clicking "Build" or pressing Enter navigates to `/app/new?prompt=...`
- Clicking a template card navigates similarly
- Layout is responsive (test at 375px and 1440px)
- No TypeScript errors, no console errors
