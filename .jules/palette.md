## 2025-01-24 - [Accessible Action Buttons and Image Fallbacks]
**Learning:** Icon-only buttons (like "Add to Cart") require explicit `aria-label` attributes to be accessible. For buttons that are disabled (e.g., "Out of Stock"), appending the state to the label (e.g., "Add to cart (Out of Stock)") provides immediate context to screen reader users. Additionally, providing a thematic fallback icon (e.g., a `Leaf` icon for a dispensary) for failed image loads ensures the UI remains polished and meaningful even when assets are missing.
**Action:** Always wrap icon-only buttons in `Tooltip` components and provide descriptive `aria-label` attributes. Implement `onError` handlers on product images to show high-quality fallback icons.

## 2025-05-23 - [Context-Aware Localization for Accessibility]
**Learning:** Avoid modifying global i18n keys (like `common.quantity`) to fit specific ARIA label or tooltip requirements, as this can break UI consistency elsewhere. Instead, create context-specific keys within relevant namespaces (e.g., `cart.increaseQuantity`) to support natural linguistic phrasing (like "augmenter la quantité de" in French) without affecting capitalized labels or headers.
**Action:** Create separate, descriptive i18n keys for ARIA labels and tooltips in the appropriate namespace when linguistic naturalness is required for screen readers.
