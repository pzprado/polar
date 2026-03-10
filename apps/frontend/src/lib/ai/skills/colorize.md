# Colorize Skill

Use color strategically to communicate meaning, create hierarchy, and add warmth. More color does not mean better — every color needs a purpose.

## Semantic Colors

Apply consistent meaning across the app:
- **Success/positive**: `#16a34a` (green-600) — confirmations, live status, completed actions
- **Error/danger**: `#dc2626` (red-600) — failures, destructive actions, validation errors
- **Warning/caution**: `#d97706` (amber-600) — pending states, important notices
- **Info/neutral**: `#2563eb` (blue-600) — informational, links, secondary actions
- **Primary accent**: `#E84142` (Polar red) — primary buttons, brand elements, key CTAs

## Color Application

- **Status indicators**: Use colored dots (8px) with matching text. Green dot + "Live", amber dot + "Pending".
- **Backgrounds for states**: Use very low opacity fills. Success: `rgba(22,163,74,0.08)`. Error: `rgba(220,38,38,0.08)`.
- **Interactive elements**: Primary actions get `#E84142`. Secondary actions get subtle borders or ghost style. Destructive actions get red only on confirmation.
- **Data and categories**: If showing different types (tokens, games, tipping), assign each a consistent color from the palette.

## Balance

- 60% of the UI should be neutral (warm whites, tinted grays).
- 30% should be supporting color (status indicators, section backgrounds, borders).
- 10% should be accent (primary buttons, active states, key highlights).
- Never make everything colorful. Restraint makes the accent colors more powerful.

## Palette for Inline Styles

Since you use inline styles, here's the ready-to-use palette:

```
Primary: #E84142 (Polar red)
Primary hover: #dc2626
Text primary: #1C1917
Text secondary: #57534E
Text muted: #78716C
Text faint: #A8A29E
Surface: #FEFDFB
Background: #F8F6F3
Border: rgba(0,0,0,0.08)
Success: #16a34a
Error: #dc2626
Warning: #d97706
Info: #2563eb
```

## Rules

- Never use color as the only indicator — pair with icons or text for accessibility.
- Don't put gray text on colored backgrounds. Use a darker shade of the background color.
- Don't use rainbow palettes. Stick to 2-3 accent colors beyond neutrals.
- Ensure 4.5:1 contrast ratio for all text.
