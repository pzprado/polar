# Delight Skill

Add moments of personality and polish that make the app feel crafted, not generated. Delight should enhance usability, never delay it.

## Loading & Waiting States

- Show a skeleton or placeholder layout while data loads — not a centered spinner.
- Use specific loading messages: "Connecting to your wallet...", "Sending tip...", "Waiting for confirmation..."
- For multi-step processes, show a progress indicator with the current step.
- Add subtle CSS animations to loading indicators (pulse, fade).

## Success Moments

- When a transaction succeeds, show a clear confirmation with:
  - A green checkmark icon
  - A brief congrats message ("Tip sent!" not "Transaction successful")
  - The key detail (amount, recipient, tx hash)
  - A next action ("Send another" or "View on explorer")
- Use a subtle scale + fade-in CSS animation for the success state.

## Empty States with Personality

- Don't just say "No data" — make empty states welcoming:
  - Explain what will appear here
  - Include a visual element (emoji or simple illustration via CSS)
  - Provide a clear first action
- Example: A tipping app with no tips yet could show "Your tip jar is empty. Share your page to start receiving tips."

## Interactive Feedback

- Buttons should have clear hover and active states via inline styles:
  - Hover: slightly darker background, subtle transform
  - Active/pressed: darker still, slight scale down
  - Disabled: reduced opacity (0.5), `cursor: not-allowed`
- Input focus: add a colored border or box-shadow ring.
- Form validation: show inline feedback as soon as the user leaves a field.

## CSS Animations (Inline-Safe)

Since you can't import animation libraries, use CSS keyframes via a `<style>` tag in the component:

```jsx
<style>{`
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
`}</style>
```

Then apply via `style={{ animation: 'fadeIn 0.3s ease-out' }}`.

## Rules

- Delight moments must be fast (< 300ms for feedback, < 500ms for transitions).
- Never delay core functionality for delight.
- Don't animate everything — pick 2-3 key moments per screen.
- Respect the user's context: don't be playful during errors or failures.
- Keep animations subtle. No bounce, no elastic, no parallax.
