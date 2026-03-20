## 2025-01-24 - [Accessible Action Buttons and Image Fallbacks]
**Learning:** Icon-only buttons (like "Add to Cart") require explicit `aria-label` attributes to be accessible. For buttons that are disabled (e.g., "Out of Stock"), appending the state to the label (e.g., "Add to cart (Out of Stock)") provides immediate context to screen reader users. Additionally, providing a thematic fallback icon (e.g., a `Leaf` icon for a dispensary) for failed image loads ensures the UI remains polished and meaningful even when assets are missing.
**Action:** Always wrap icon-only buttons in `Tooltip` components and provide descriptive `aria-label` attributes. Implement `onError` handlers on product images to show high-quality fallback icons.

## 2025-01-24 - [Comprehensive Cart Accessibility & i18n]
**Learning:** For interactive cart components, accessibility goes beyond just labeling. Using `aria-live="polite"` on quantity displays ensures that screen reader users receive immediate feedback when they increase or decrease items without being interrupted. Furthermore, providing a success toast notification when an item is removed offers crucial visual and non-visual confirmation for destructive actions, preventing user confusion.
**Action:** Implement `aria-live` for dynamic text updates and always provide immediate feedback (like toasts) for state-changing actions like removal or deletion.
