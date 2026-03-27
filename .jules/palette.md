## 2025-01-24 - [Accessible Action Buttons and Image Fallbacks]
**Learning:** Icon-only buttons (like "Add to Cart") require explicit `aria-label` attributes to be accessible. For buttons that are disabled (e.g., "Out of Stock"), appending the state to the label (e.g., "Add to cart (Out of Stock)") provides immediate context to screen reader users. Additionally, providing a thematic fallback icon (e.g., a `Leaf` icon for a dispensary) for failed image loads ensures the UI remains polished and meaningful even when assets are missing.
**Action:** Always wrap icon-only buttons in `Tooltip` components and provide descriptive `aria-label` attributes. Implement `onError` handlers on product images to show high-quality fallback icons.

## 2026-03-27 - [Cart Accessibility and Form Labeling]
**Learning:** For dynamic UI elements like shopping cart quantities, adding `aria-live="polite"` to the display value ensures that screen reader users are notified of updates as they occur. Furthermore, ensuring that form labels (like a delivery address textarea) are explicitly linked to their inputs using `htmlFor` and `id` is crucial for accessibility and user experience, especially in a focused flow like checkout.
**Action:** Use `aria-live="polite"` on dynamic counters and always verify that form labels are explicitly associated with their corresponding input elements.
