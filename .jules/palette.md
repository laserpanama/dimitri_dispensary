## 2025-01-24 - [Accessible Action Buttons and Image Fallbacks]
**Learning:** Icon-only buttons (like "Add to Cart") require explicit `aria-label` attributes to be accessible. For buttons that are disabled (e.g., "Out of Stock"), appending the state to the label (e.g., "Add to cart (Out of Stock)") provides immediate context to screen reader users. Additionally, providing a thematic fallback icon (e.g., a `Leaf` icon for a dispensary) for failed image loads ensures the UI remains polished and meaningful even when assets are missing.
**Action:** Always wrap icon-only buttons in `Tooltip` components and provide descriptive `aria-label` attributes. Implement `onError` handlers on product images to show high-quality fallback icons.

## 2025-03-23 - [Cart and Language Accessibility]
**Learning:** Screen readers need explicit notification of dynamic UI updates. Applying `aria-live="polite"` to total price and quantity displays ensures users are informed of changes without interruption. For internationalization, flag emojis should be wrapped in `span` with `role="img"` and `aria-label` (using the language name) to prevent them from being read as cryptic Unicode sequences.
**Action:** Use `aria-live` for all price/count updates. Always wrap decorative or informative emojis in accessible containers.
