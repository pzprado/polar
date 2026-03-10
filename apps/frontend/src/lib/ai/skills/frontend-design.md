# Frontend Design Skill

You produce distinctive, polished UI — not generic AI-generated interfaces. Every component should look intentionally designed.

## Typography

- Use a clear 3-level hierarchy: heading (24-28px, bold), subheading (16-18px, semibold), body (14-15px, normal).
- Set `line-height: 1.5` for body text, `1.2` for headings.
- Limit line length to ~65 characters for readability.
- Use `letter-spacing: -0.02em` on headings for a tighter, designed feel.
- Never use monospace fonts as a lazy shorthand for "technical."

## Color

- Build from a small palette: one primary accent, one neutral scale, semantic colors (success green, error red, warning amber).
- Use the Polar red `#E84142` as the primary accent for buttons and key actions.
- Tint your neutrals warm — never use pure gray. Example neutral scale: `#1C1917`, `#57534E`, `#78716C`, `#A8A29E`, `#D6D3D1`, `#F5F5F4`.
- Apply the 60-30-10 rule: 60% neutral backgrounds/text, 30% supporting colors, 10% accent.
- Meet WCAG contrast: body text 4.5:1 minimum against background.
- Never use pure black `#000` or pure white `#fff` for large areas.
- Never use gray text on colored backgrounds — use a darker shade of the background instead.

## Layout & Spacing

- Use a 4px-based spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px.
- Create visual rhythm with varied spacing — tight groupings for related items, generous gaps between sections.
- Don't wrap everything in cards. Use spacing and alignment to create structure.
- Never nest cards inside cards.
- Left-align text by default. Center only for hero/CTA sections.
- Use `max-width` to constrain content width for readability.
- Use flexbox with `gap` for consistent spacing between children.

## Visual Details

- Use `border-radius: 8-12px` for cards and containers, `6px` for buttons and inputs, `9999px` for pills.
- Prefer subtle box-shadows over borders: `0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)`.
- Use borders sparingly — `1px solid` with low-opacity colors like `rgba(0,0,0,0.08)`.
- Use opacity and color to indicate interactive states, not just cursor changes.

## Anti-Patterns (NEVER DO THESE)

- Don't put large icons with rounded corners above every heading.
- Don't use identical card grids — same-sized cards with icon + heading + text, repeated endlessly.
- Don't use gradient text for impact.
- Don't use glassmorphism (blur effects, glass cards, glow borders).
- Don't use purple-to-blue gradients (the AI slop palette).
- Don't use bounce or elastic easing — real objects decelerate smoothly.
- Don't repeat information the user can already see.
- Don't make every button primary. Use visual hierarchy: one primary action, rest secondary/ghost.
