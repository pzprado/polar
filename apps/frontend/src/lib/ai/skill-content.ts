/**
 * AI generation skills — design and quality guidelines injected into the system prompt.
 *
 * Each skill is a focused set of rules that the LLM follows when generating
 * React components. The source-of-truth markdown lives in ./skills/*.md;
 * this file re-exports the content as strings so it bundles reliably on Vercel.
 *
 * To add a new skill: create the .md file, then add a named export here.
 */

export const SKILL_FRONTEND_DESIGN = `# Frontend Design

You produce distinctive, polished UI — not generic AI-generated interfaces. Every component should look intentionally designed.

## Typography
- Use a clear 3-level hierarchy: heading (24-28px, bold), subheading (16-18px, semibold), body (14-15px, normal).
- Set line-height: 1.5 for body text, 1.2 for headings.
- Limit line length to ~65 characters for readability.
- Use letter-spacing: -0.02em on headings for a tighter, designed feel.

## Color
- Build from a small palette: one primary accent, one neutral scale, semantic colors (success green, error red, warning amber).
- Use Polar red #E84142 as the primary accent for buttons and key actions.
- Tint neutrals warm — never use pure gray. Neutral scale: #1C1917, #57534E, #78716C, #A8A29E, #D6D3D1, #F5F5F4.
- 60-30-10 rule: 60% neutral backgrounds/text, 30% supporting colors, 10% accent.
- Body text contrast: 4.5:1 minimum against background.

## Layout & Spacing
- Use a 4px-based scale: 4, 8, 12, 16, 24, 32, 48, 64px.
- Create visual rhythm with varied spacing — tight for related items, generous between sections.
- Don't wrap everything in cards. Use spacing and alignment to create structure.
- Left-align text by default. Center only for hero/CTA sections.
- Use flexbox with gap for consistent spacing between children.

## Visual Details
- border-radius: 8-12px for containers, 6px for buttons/inputs, 9999px for pills.
- Prefer subtle box-shadows: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)".
- Use borders sparingly — 1px solid with low-opacity colors like rgba(0,0,0,0.08).

## Anti-Patterns (NEVER)
- No large icons with rounded corners above headings.
- No identical card grids with icon + heading + text repeated.
- No gradient text. No glassmorphism. No purple-blue gradients.
- No bounce/elastic easing. No monospace fonts for "technical" feel.
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

## Semantic Colors
- Success: #16a34a (green) — confirmations, live status, completed
- Error: #dc2626 (red) — failures, destructive actions, validation
- Warning: #d97706 (amber) — pending states, notices
- Info: #2563eb (blue) — informational, links, secondary actions
- Primary: #E84142 (Polar red) — primary buttons, brand elements

## Application
- Status indicators: colored dots (8px) + matching text. Green dot + "Live".
- State backgrounds: very low opacity. Success: rgba(22,163,74,0.08). Error: rgba(220,38,38,0.08).
- Primary actions: #E84142. Secondary: subtle borders/ghost. Destructive: red on confirmation only.

## Ready-to-Use Palette
Primary: #E84142, Primary hover: #dc2626
Text: #1C1917 (primary), #57534E (secondary), #78716C (muted), #A8A29E (faint)
Surface: #FEFDFB, Background: #F8F6F3, Border: rgba(0,0,0,0.08)
Success: #16a34a, Error: #dc2626, Warning: #d97706, Info: #2563eb

## Rules
- Never use color as the only indicator — pair with icons or text.
- Don't put gray text on colored backgrounds.
- Stick to 2-3 accent colors beyond neutrals. Ensure 4.5:1 text contrast.`;

export const SKILL_DELIGHT = `# Delight

Add personality and polish. Delight enhances usability, never delays it.

## Loading States
- Show skeleton/placeholder layouts while loading — not a centered spinner.
- Use specific messages: "Connecting wallet...", "Sending tip..."
- For multi-step processes, show progress with the current step.

## Success Moments
- Green checkmark + brief congrats: "Tip sent!" not "Transaction successful"
- Show key detail (amount, tx hash) + next action ("Send another" / "View on explorer")
- Subtle scale + fade-in CSS animation for success state.

## Empty States
- Make them welcoming: explain what will appear, provide a first action.
- Example: "Your tip jar is empty. Share your page to start receiving tips."

## Interactive Feedback
- Buttons: hover (slightly darker), active (scale down slightly), disabled (opacity 0.5, cursor: not-allowed).
- Input focus: colored border or box-shadow ring.
- Form validation: inline feedback on blur.

## CSS Animations
Use a <style> tag for keyframes since you can't import animation libraries:
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
@keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.5 } }
@keyframes spin { to { transform: rotate(360deg) } }
Then apply: style={{ animation: 'fadeIn 0.3s ease-out' }}

## Rules
- Animations < 300ms for feedback, < 500ms for transitions.
- Pick 2-3 key animation moments per screen, not everything.
- No bounce, no elastic, no parallax. Keep it subtle.`;

export const SKILL_ADAPT = `# Responsive Design

Apps must work on both desktop and mobile. Users share app links that get opened on phones.

## Layout
- Flexbox with flexWrap: 'wrap' for reflowing layouts.
- maxWidth on containers (640px for focused apps, 960px for dashboards).
- Percentage widths or flex: 1 instead of fixed pixels.
- Stack vertically on narrow screens — no horizontal scrolling.

## Responsive Patterns (Inline Styles)
- Flexbox wrapping: display: 'flex', flexWrap: 'wrap', gap: '16px'
- Min-width children: flex: '1 1 280px' — items wrap below 280px.
- Use a <style> tag for media queries when needed:
  @media (max-width: 640px) { .card-grid { flex-direction: column } }

## Touch Targets
- All interactive elements: at least 44x44px.
- Add padding to small elements to increase tap area.
- Space interactive elements 8px+ apart.
- Buttons: padding 12px 24px minimum.

## Text & Inputs
- Body text: 14-16px minimum. Never below 12px.
- Inputs: width 100%, fontSize 16px (prevents iOS zoom).
- Use inputMode="numeric" for numbers, inputMode="decimal" for amounts.`;

export const SKILL_HARDEN = `# Resilience

Blockchain interactions fail often. Handle every failure gracefully.

## Wallet Connection
- Check window.ethereum exists before connecting.
- Show "Connect Wallet" button — don't auto-connect.
- Handle rejection: "Connection declined. Click to try again."
- Handle missing wallet: "No wallet detected. Install MetaMask to continue."
- Show connected address truncated: 0x1234...abcd.

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
- Truncate long addresses/hashes with ellipsis.
- Format large numbers with commas (1,000,000).
- Handle zero/null explicitly — never show "undefined" or "NaN".
- AVAX amounts: 4 decimal places max.

## State Management
- Track loading per action, not one global isLoading.
- After success, refresh relevant data (balances, lists).
- Initialize with sensible defaults — render something useful before wallet connection.`;

/** All skills concatenated, ready to inject into the system prompt. */
export function getAllSkillContent(): string {
  return [
    SKILL_FRONTEND_DESIGN,
    SKILL_COPYWRITING,
    SKILL_COLORIZE,
    SKILL_DELIGHT,
    SKILL_ADAPT,
    SKILL_HARDEN,
  ].join("\n\n---\n\n");
}
