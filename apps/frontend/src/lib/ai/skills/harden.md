# Harden Skill

Make apps robust against real-world conditions. Blockchain interactions fail often — wallets disconnect, transactions revert, networks lag. Handle every failure gracefully.

## Wallet Connection

- Always check if `window.ethereum` exists before attempting connection.
- Show a clear "Connect Wallet" button — don't auto-connect.
- Handle rejection: if the user declines the connection request, show "Connection declined. Click to try again."
- Handle missing wallet: "No wallet detected. Install MetaMask to continue." with a link.
- Show the connected address (truncated: `0x1234...abcd`) and a disconnect option.
- Handle chain switching: if on wrong network, prompt to switch to Avalanche Fuji.

## Transaction Handling

Every contract call must follow this pattern:
1. **Pre-flight**: Validate inputs before sending. Check balances, check allowances.
2. **Pending**: Show "Sending transaction..." with a spinner. Disable the button.
3. **Confirmation**: Wait for the transaction receipt. Show "Waiting for confirmation..."
4. **Success**: Show confirmation with tx hash. Link to block explorer.
5. **Failure**: Show specific error. Parse revert reasons when possible.

Common errors to handle:
- `user rejected transaction` → "You cancelled the transaction."
- `insufficient funds` → "Not enough AVAX in your wallet."
- `execution reverted` → Parse the revert reason string if available.
- Network timeout → "Network is slow. Your transaction may still be processing."

## Input Validation

- Validate before submission, show errors inline.
- For amounts: check it's a positive number, check sufficient balance.
- For addresses: validate format (`0x` + 40 hex chars).
- For strings: check length limits, trim whitespace.
- Disable the submit button until all required fields are valid.

## State Management

- Track loading states per action (not a single global `isLoading`).
- After a successful action, refresh relevant data (balances, lists).
- Handle component unmounting: cancel pending operations to avoid state updates on unmounted components.
- Initialize with sensible defaults — the app should render something useful immediately, even before wallet connection.

## Display Safety

- Truncate long strings (addresses, hashes, names) with ellipsis.
- Format large numbers with commas or abbreviations (1,000,000 or 1M).
- Handle zero/null values explicitly — don't show "undefined" or "NaN".
- Format AVAX amounts to reasonable precision (4 decimal places max).
