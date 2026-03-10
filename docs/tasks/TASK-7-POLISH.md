# Task 7: Polish + Testing + Deploy Prep

**Priority**: Final task, after everything works
**Estimated time**: ~30 minutes
**Dependencies**: Task 6 (all integration complete)

## Objective

Polish the UI, handle edge cases, verify end-to-end flow, and prepare for Vercel deployment.

## Checklist

### 1. End-to-End Testing

Run through the full flow manually:

1. `pnpm dev` — app starts without errors
2. Dashboard loads at `/` — heading, prompt input, chips, template grid, footer all render
3. Click "Loyalty Token" chip → textarea fills with prompt
4. Click "Build" → redirects to `/app/new?prompt=...`
5. Builder page loads → auto-generates
6. Left panel: user prompt bubble + "Generating..." + AI explanation bubble
7. Center panel: Sandpack preview renders the React component
8. Right panel: Frontend tab shows React code, Contract tab shows Solidity
9. Click "Deploy to Avalanche" → spinner → success
10. Deploy result shows contract address + Snowtrace testnet link
11. Verify Snowtrace link resolves (requires funded Fuji wallet)

Test with each template type:
- "Create a loyalty token called CafePoints for my coffee shop" → token
- "Create an NFT collection called PixelPals for digital art" → nft
- "Create a coin flip betting game" → game
- "Create a tipping page for my podcast" → tipping

### 2. Error Handling

Verify these error scenarios are handled gracefully:

- [ ] No API key configured → helpful error message
- [ ] Claude API rate limit → error in chat
- [ ] Invalid/malformed AI response → parser fallback with error message
- [ ] Solidity compilation error → error shown in deploy result
- [ ] No Fuji wallet configured → error in deploy result
- [ ] Network timeout → error with retry option
- [ ] Empty prompt submitted → prevented by UI (button disabled)

### 3. UI Polish

#### Typography
- [ ] Heading sizes follow a consistent scale (not arbitrary px values)
- [ ] Body text is readable (14-16px)
- [ ] Code/monospace is properly sized (12-13px)
- [ ] Font weights are intentional (400 body, 500 medium, 600 semibold, 700 bold)

#### Colors
- [ ] Avalanche red `#E84142` used ONLY for primary CTAs
- [ ] Text uses gray-700/800/900 (not pure black)
- [ ] Muted text uses gray-400/500
- [ ] Borders use gray-200
- [ ] Backgrounds: white and gray-50 only
- [ ] No random colors — everything is from the gray + red palette

#### Spacing
- [ ] Consistent padding (p-3, p-4, or p-6 — not arbitrary)
- [ ] Section spacing is generous (py-12, py-16, or py-20)
- [ ] Card internal spacing is consistent

#### Interactions
- [ ] Buttons have hover states (slightly darker)
- [ ] Cards have hover states (subtle shadow increase)
- [ ] Transitions are smooth (transition-all, duration-200)
- [ ] Loading spinners use `animate-spin`
- [ ] Focus states are visible (for accessibility)
- [ ] Disabled states are visually distinct (opacity-50)

#### Layout
- [ ] Dashboard is centered (max-w-5xl or max-w-6xl mx-auto)
- [ ] Builder fills viewport (h-screen)
- [ ] No unwanted scrollbars
- [ ] Panels scroll independently (ScrollArea in chat and code)

### 4. Loading States

Ensure these loading states exist and look good:

- [ ] Dashboard: instant load (no skeleton needed — all static)
- [ ] Builder: generation loading (spinner in chat + skeleton in preview)
- [ ] Builder: deploy loading (spinner in button)
- [ ] Preview: Sandpack loading (built-in loader is fine)

### 5. Kite Branding

- [ ] Footer mentions "Powered by Kite"
- [ ] Deploy result has "Enable Kite AI payments — coming soon" teaser
- [ ] No fake Kite functionality — just branded mentions

### 6. Metadata + SEO

Update `src/app/layout.tsx` metadata:

```typescript
export const metadata: Metadata = {
  title: "Polar — Build Web3 Apps on Avalanche",
  description: "Describe your web3 app in plain English. Polar generates the code and deploys it to Avalanche.",
  openGraph: {
    title: "Polar — Build Web3 Apps on Avalanche",
    description: "AI-powered web3 app builder for Avalanche",
    type: "website",
  },
};
```

### 7. Favicon

Create a simple favicon. Options:
- Use a mountain emoji as a quick placeholder
- Generate a simple SVG favicon with Avalanche-themed colors

Place in `src/app/favicon.ico` or `public/favicon.svg`.

### 8. Environment Variable Validation

Add a simple check on server startup or in API routes:

```typescript
// In each API route, validate required env vars
const requiredVars = {
  "/api/generate": ["ANTHROPIC_API_KEY"],
  "/api/deploy": ["DEPLOYER_PRIVATE_KEY"],
};
```

### 9. `.env.local.example`

Ensure this file exists with all variables documented:

```
# Required for AI generation (Claude API)
ANTHROPIC_API_KEY=sk-ant-...

# Required for contract deployment (Fuji testnet wallet)
DEPLOYER_PRIVATE_KEY=0x...

# Avalanche Fuji Testnet Configuration
NEXT_PUBLIC_FUJI_RPC=https://api.avax-test.network/ext/bc/C/rpc
NEXT_PUBLIC_CHAIN_ID=43113
NEXT_PUBLIC_EXPLORER_URL=https://testnet.snowtrace.io
```

### 10. Vercel Deploy Prep

- [ ] `runtime = 'nodejs'` on `/api/deploy` route (solc-js needs Node)
- [ ] `runtime = 'nodejs'` on `/api/generate` route (recommended for stability)
- [ ] No `fs` usage in client components
- [ ] All env vars documented in `.env.local.example`
- [ ] `next.config.ts` doesn't have conflicting settings
- [ ] `pnpm build` succeeds without errors

Test the production build:

```bash
pnpm build
pnpm start
```

### 11. Console Cleanup

- [ ] Remove all `console.log` debug statements
- [ ] Keep `console.error` for actual errors in API routes
- [ ] No warnings in browser console
- [ ] No TypeScript warnings in build output

### 12. Accessibility Quick Pass

- [ ] All buttons have accessible labels
- [ ] Form inputs have labels or aria-labels
- [ ] Color contrast meets WCAG AA (especially red on white)
- [ ] Focus is visible on interactive elements
- [ ] Links are distinguishable from text

## Final Verification

After all polish is done, do one final E2E run:

1. Fresh `pnpm dev`
2. Load `/` — visually inspect
3. Submit a prompt → builder page
4. Wait for generation → verify preview + code
5. Deploy (if wallet is funded) → verify contract on Snowtrace
6. `pnpm build` → no errors
7. `pnpm start` → production mode works

## Output

- All visual issues fixed
- Error handling complete
- `.env.local.example` present and documented
- `pnpm build` succeeds
- Ready for Vercel deployment and hackathon submission
