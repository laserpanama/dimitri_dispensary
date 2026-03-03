## 2025-01-24 - [Accessible Action Buttons and Image Fallbacks]
**Learning:** Icon-only buttons (like "Add to Cart") require explicit `aria-label` attributes to be accessible. For buttons that are disabled (e.g., "Out of Stock"), appending the state to the label (e.g., "Add to cart (Out of Stock)") provides immediate context to screen reader users. Additionally, providing a thematic fallback icon (e.g., a `Leaf` icon for a dispensary) for failed image loads ensures the UI remains polished and meaningful even when assets are missing.
**Action:** Always wrap icon-only buttons in `Tooltip` components and provide descriptive `aria-label` attributes. Implement `onError` handlers on product images to show high-quality fallback icons.

## 2025-01-24 - [Chat Widget Accessibility and Immediacy]
**Learning:** Chat widgets and similar floating interfaces benefit significantly from `aria-live="polite"` and `role="log"` to ensure screen reader users are notified of new messages without being interrupted. Furthermore, auto-focusing the primary input field (with a short delay to account for open animations) drastically improves "immediacy" — the feeling that the app is ready for the user's next action.
**Action:** Use `role="log"` and `aria-live="polite"` for message containers. Implement auto-focus on the main input of interactive widgets using a `useEffect` hook with a 100ms timeout.
