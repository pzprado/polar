/**
 * AI generation skills — design and quality guidelines injected into the system prompt.
 *
 * Each skill is a focused set of rules that the LLM follows when generating
 * React components. Uses Tailwind CSS classes for all styling.
 *
 * To add a new skill: create the export, then add it to getAllSkillContent().
 */

export const SKILL_FRONTEND_DESIGN = `# Frontend Design

You produce distinctive, polished UI — not generic AI-generated interfaces. Every component should look intentionally designed.

## Typography (Tailwind)
- Headings: \`text-2xl font-bold tracking-tight\` or \`text-xl font-semibold\`
- Subheadings: \`text-lg font-semibold\` or \`text-base font-medium\`
- Body: \`text-sm text-gray-600\` or \`text-base text-gray-700\`
- Muted: \`text-xs text-gray-400\`
- Max width for readability: \`max-w-prose\`

## Color (Tailwind)
- Primary accent: \`bg-polar text-white hover:bg-polar-dark\` (Polar red #E84142)
- Warm neutral scale: stone palette — \`text-stone-900\`, \`text-stone-600\`, \`text-stone-400\`, \`bg-stone-50\`
- 60-30-10: mostly neutral backgrounds, supporting stone tones, 10% polar accent
- Body text contrast: always \`text-stone-700\` or darker on white/light backgrounds

## Layout & Spacing (Tailwind)
- Spacing scale: \`p-1\` (4px), \`p-2\` (8px), \`p-3\` (12px), \`p-4\` (16px), \`p-6\` (24px), \`p-8\` (32px)
- Sections: \`space-y-6\` or \`space-y-8\` between major sections
- Related items: \`space-y-2\` or \`gap-2\`
- Container: \`max-w-2xl mx-auto px-4 py-8\` for focused apps, \`max-w-4xl\` for dashboards
- Use \`flex\` with \`gap-*\` for horizontal layouts, \`flex flex-col gap-*\` for vertical
- Left-align by default. \`text-center\` only for hero/CTA sections.

## Visual Details (Tailwind)
- Containers: \`rounded-xl\` (12px) or \`rounded-lg\` (8px)
- Buttons/inputs: \`rounded-md\` (6px)
- Pills/badges: \`rounded-full\`
- Shadows: \`shadow-sm\` for cards. Never \`shadow-2xl\`.
- Borders: \`border border-black/[0.08]\` — subtle, low opacity

## Anti-Patterns (NEVER)
- No large icons with rounded corners above headings
- No identical card grids with icon + heading + text repeated
- No gradient text. No glassmorphism. No purple-blue gradients.
- No bounce/elastic animations. No monospace fonts for "technical" feel.
- Not every button primary — one primary action, rest secondary/ghost.`;

export const SKILL_COPYWRITING = `# Copywriting

Write clear, friendly UI text. The audience is creators — not technical, so keep language simple and encouraging.

## Labels & Buttons
- Specific verb + object: "Send Tip", "Join Game", "Mint Token" — not "Submit" or "OK".
- Primary CTA states the outcome: "Publish App", "Create Rewards Program".
- Keep button text to 2-4 words.

## Error Messages
Every error answers: What happened? Why? How to fix?
- Bad: "Transaction failed" → Good: "Transaction failed — not enough AVAX. You need at least 0.1 AVAX."
- Bad: "Error" → Good: "Couldn't connect wallet. Make sure MetaMask is unlocked and try again."
- Never use humor in errors. Be direct and helpful.

## Empty States
Teach, don't just say "nothing here":
- Bad: "No transactions" → Good: "No tips yet. Share your page link to start receiving."
- Include a clear action to get started.

## Loading States
Be specific: "Connecting to wallet...", "Sending tip...", "Checking results..." — not "Loading..."

## Tone
- Confident: "Your app is live" not "Your app should be live now"
- Friendly: "Nice — your token is ready" not "Token creation successful"
- Brief: every word earns its place. No exclamation marks.`;

export const SKILL_COLORIZE = `# Color Strategy

Use color to communicate meaning and create hierarchy. Every color needs a purpose.

## Semantic Colors (Tailwind)
- Success: \`text-green-600 bg-green-50 border-green-200\`
- Error: \`text-red-600 bg-red-50 border-red-200\`
- Warning: \`text-amber-600 bg-amber-50 border-amber-200\`
- Info: \`text-blue-600 bg-blue-50 border-blue-200\`
- Primary: \`text-white bg-polar hover:bg-polar-dark\`

## Application
- Status indicators: \`<span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500" />Live</span>\`
- State backgrounds: use very light tints: \`bg-green-50\`, \`bg-red-50\`
- Primary actions: \`bg-polar\`. Secondary: \`bg-stone-100\` or \`border border-stone-200\`. Destructive: red on confirmation only.

## Rules
- Never use color as the only indicator — pair with icons or text.
- Don't put gray text on colored backgrounds.
- Stick to 2-3 accent colors beyond neutrals.`;

export const SKILL_DELIGHT = `# Delight

Add personality and polish. Delight enhances usability, never delays it.

## Loading States
- Show skeleton/placeholder layouts: \`<div className="h-4 w-32 animate-pulse rounded bg-stone-200" />\`
- Use specific messages: "Connecting wallet...", "Sending tip..."
- For multi-step processes, show progress with the current step.

## Success Moments
- Green checkmark + brief congrats: "Tip sent!" not "Transaction successful"
- Show key detail (amount, tx hash) + next action
- Subtle entrance: use Tailwind \`animate-in\` or a simple CSS @keyframes fadeIn

## Interactive Feedback (Tailwind)
- Buttons: \`hover:bg-polar-dark active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-colors\`
- Input focus: \`focus:ring-2 focus:ring-polar/20 focus:border-polar outline-none\`
- Transitions: \`transition-all duration-200\`

## CSS Animations
For custom animations, add a \`<style>\` tag in the component:
\`\`\`
<style>{\`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }\`}</style>
\`\`\`
Then use: \`style={{ animation: 'fadeIn 0.3s ease-out' }}\`

## Rules
- Animations < 300ms for feedback, < 500ms for transitions.
- Pick 2-3 key animation moments per screen, not everything.
- No bounce, no elastic, no parallax.`;

export const SKILL_ADAPT = `# Responsive Design

Apps must work on both desktop and mobile. Users share app links that get opened on phones.

## Layout (Tailwind)
- Container: \`max-w-2xl mx-auto px-4\`
- Responsive grid: \`grid grid-cols-1 sm:grid-cols-2 gap-4\`
- Stack on mobile: \`flex flex-col sm:flex-row gap-4\`
- Full-width on mobile: \`w-full sm:w-auto\`

## Touch Targets
- All interactive elements: \`min-h-[44px]\` at minimum
- Buttons: \`px-4 py-2.5\` minimum padding
- Space interactive elements: \`gap-2\` or more apart

## Text & Inputs
- Body text: \`text-sm\` (14px) minimum. Never \`text-[10px]\`.
- Inputs: \`w-full text-base\` (16px prevents iOS zoom)
- Use \`inputMode="numeric"\` for numbers, \`inputMode="decimal"\` for amounts`;

export const SKILL_HARDEN = `# Resilience

Blockchain interactions fail often. Handle every failure gracefully.

## Transaction Handling
Every contract call: validate inputs → show pending state → wait for receipt → show result.
- Disable the button and show spinner during pending.
- On success: green confirmation + tx hash + next action.
- On failure: parse the error and show specific message.
Common errors:
- user rejected → "You cancelled the transaction."
- insufficient funds → "Not enough AVAX in your wallet."
- execution reverted → Parse revert reason if available.

## Input Validation
- Validate before submission with inline errors.
- Amounts: positive number, sufficient balance.
- Addresses: 0x + 40 hex chars.
- Disable submit until all required fields valid.

## Display Safety
- Truncate long addresses/hashes with \`truncate\` class.
- Format large numbers with commas.
- Handle zero/null explicitly — never show "undefined" or "NaN".
- AVAX amounts: 4 decimal places max.

## State Management
- Track loading per action, not one global isLoading.
- After success, refresh relevant data (balances, lists).
- Initialize with sensible defaults — render something useful before wallet connection.`;

export const SKILL_COMPONENT_PATTERNS = `# Component Patterns (Tailwind)

Generate polished, consistent components using Tailwind utility classes.

## Buttons
- Primary: \`className="bg-polar hover:bg-polar-dark text-white font-medium px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"\`
- Secondary: \`className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium px-4 py-2.5 rounded-lg transition-colors"\`
- Outline: \`className="border border-stone-200 hover:bg-stone-50 text-stone-700 font-medium px-4 py-2.5 rounded-lg transition-colors"\`
- Ghost: \`className="hover:bg-stone-100 text-stone-600 font-medium px-4 py-2.5 rounded-lg transition-colors"\`
- One primary action per section. Secondary actions use outline or ghost.

## Inputs
- Base: \`className="w-full h-10 px-3 text-sm border border-stone-200 rounded-lg outline-none focus:ring-2 focus:ring-polar/20 focus:border-polar transition-all"\`
- Error: add \`border-red-300 focus:ring-red-200\` with \`<p className="text-xs text-red-500 mt-1">Error message</p>\` below
- Label: \`className="block text-sm font-medium text-stone-700 mb-1.5"\`

## Cards
- \`className="bg-white border border-black/[0.08] rounded-xl p-6 shadow-sm"\`
- Card header: \`<h3 className="text-base font-semibold text-stone-900">Title</h3><p className="text-sm text-stone-500 mt-1">Description</p>\`

## Badges
- \`className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full"\`
- Success: \`bg-green-50 text-green-700\`
- Error: \`bg-red-50 text-red-700\`
- Warning: \`bg-amber-50 text-amber-700\`
- Info: \`bg-blue-50 text-blue-700\`

## Layout
- Group related actions: \`flex items-center gap-2\`
- Stack forms: \`flex flex-col gap-4\`
- Separator: \`<div className="border-t border-black/[0.08] my-4" />\`
- Page wrapper: \`<div className="min-h-screen bg-stone-50"><div className="max-w-2xl mx-auto px-4 py-8">...</div></div>\``;

export const SKILL_WAGMI_PATTERNS = `# Wagmi/Viem Patterns

All blockchain interaction uses wagmi hooks and viem utilities. Follow these patterns EXACTLY.

## Reading Contract Data
\`\`\`tsx
import { useReadContract } from "wagmi";

const { data: balance, isLoading } = useReadContract({
  address: window.__POLAR_CONTRACT_ADDRESS__,
  abi: contractAbi,
  functionName: "balanceOf",
  args: [userAddress],
});

// data is BigInt | undefined — always check before using
const display = balance ? formatEther(balance) : "0";
\`\`\`

## Writing to Contracts
\`\`\`tsx
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";

const { writeContract, data: hash, isPending } = useWriteContract();
const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

const handleSend = () => {
  writeContract({
    address: window.__POLAR_CONTRACT_ADDRESS__,
    abi: contractAbi,
    functionName: "tip",
    args: ["Great content!"],
    value: parseEther("0.1"), // for payable functions
  });
};
\`\`\`

## Wallet Connection
\`\`\`tsx
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

const { address, isConnected } = useAccount();
const { connect } = useConnect();
const { disconnect } = useDisconnect();

// Connect button
<button onClick={() => connect({ connector: injected() })}>
  {isConnected ? address.slice(0, 6) + "..." + address.slice(-4) : "Connect Wallet"}
</button>
\`\`\`

## Reading Native Balance
\`\`\`tsx
import { useBalance } from "wagmi";
import { formatEther } from "viem";

const { data: balance } = useBalance({ address });
// balance.value is BigInt, balance.formatted is string
const display = balance ? balance.formatted : "0";
\`\`\`

## ABI Definition
Define ABIs as const arrays for type safety:
\`\`\`tsx
const abi = [
  { type: "function", name: "balanceOf", inputs: [{ name: "owner", type: "address" }], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "transfer", inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ name: "", type: "bool" }], stateMutability: "nonpayable" },
] as const;
\`\`\``;

/** All skills concatenated, ready to inject into the system prompt. */
export function getAllSkillContent(): string {
  return [
    SKILL_WAGMI_PATTERNS,
    SKILL_FRONTEND_DESIGN,
    SKILL_COMPONENT_PATTERNS,
    SKILL_COPYWRITING,
    SKILL_COLORIZE,
    SKILL_DELIGHT,
    SKILL_ADAPT,
    SKILL_HARDEN,
  ].join("\n\n---\n\n");
}
