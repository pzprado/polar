# Adapt Skill

Generated apps must work well on both desktop and mobile. Users will share app links and visitors will open them on phones.

## Layout Strategy

- Use flexbox with `flexWrap: 'wrap'` for layouts that need to reflow.
- Set `maxWidth` on the main container (e.g., `640px` for a focused app, `960px` for a dashboard).
- Use percentage widths or `flex: 1` instead of fixed pixel widths.
- Stack elements vertically on narrow screens — avoid horizontal scrolling.

## Responsive Patterns (Inline Styles)

Since you can't use media queries in inline styles, build responsive layouts using:

1. **Flexbox wrapping**: `display: 'flex', flexWrap: 'wrap', gap: '16px'` — items wrap naturally.
2. **Min-width on flex children**: `flex: '1 1 280px'` — items take at least 280px, wrap below that.
3. **Percentage-based widths**: Use `width: '100%'` for full-width on mobile, with `maxWidth` for desktop.
4. **A `<style>` tag** for the rare case you need a media query:
   ```jsx
   <style>{`@media (max-width: 640px) { .card-grid { flex-direction: column; } }`}</style>
   ```

## Touch Targets

- All interactive elements must be at least 44x44px.
- Add padding to small elements (icons, links) to increase tap area.
- Space interactive elements at least 8px apart to prevent mis-taps.
- Use `padding: '12px 24px'` minimum for buttons.

## Text Sizing

- Body text: at least `14px`, prefer `15-16px`.
- Don't use text smaller than `12px` for anything.
- Use `rem` or `px` — not `vw` for text (breaks at extremes).

## Input Fields

- Full-width inputs on mobile: `width: '100%'`.
- Set `fontSize: '16px'` on inputs to prevent iOS zoom on focus.
- Use appropriate `inputMode` attributes: `inputMode="numeric"` for numbers, `inputMode="decimal"` for amounts.

## Rules

- Never use fixed-width layouts that break below 320px.
- Never hide core functionality on mobile — adapt, don't amputate.
- Test that the app looks reasonable from 320px to 1200px wide.
- Avoid horizontal scrolling — if content overflows, it should wrap or truncate.
