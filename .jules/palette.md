## 2025-01-24 - [Accessible Action Buttons and Image Fallbacks]
**Learning:** Icon-only buttons (like "Add to Cart") require explicit `aria-label` attributes to be accessible. For buttons that are disabled (e.g., "Out of Stock"), appending the state to the label (e.g., "Add to cart (Out of Stock)") provides immediate context to screen reader users. Additionally, providing a thematic fallback icon (e.g., a `Leaf` icon for a dispensary) for failed image loads ensures the UI remains polished and meaningful even when assets are missing.
**Action:** Always wrap icon-only buttons in `Tooltip` components and provide descriptive `aria-label` attributes. Implement `onError` handlers on product images to show high-quality fallback icons.

## 2025-05-20 - [Enhanced Chat Interaction and Focus Management]
**Learning:** Automatic focus management in conversational UI components (like a ChatWidget) significantly improves the immediacy of user interaction. Delaying the focus by ~100ms ensures it works reliably across different browser transition states when the component is opened via state change.
**Action:** Implement auto-focus on input fields within popover or modal-like components using a short delay (e.g., 100ms) to ensure focus is captured after the entrance animation/transition.
