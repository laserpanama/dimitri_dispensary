## 2025-01-24 - [Accessible Action Buttons and Image Fallbacks]
**Learning:** Icon-only buttons (like "Add to Cart") require explicit `aria-label` attributes to be accessible. For buttons that are disabled (e.g., "Out of Stock"), appending the state to the label (e.g., "Add to cart (Out of Stock)") provides immediate context to screen reader users. Additionally, providing a thematic fallback icon (e.g., a `Leaf` icon for a dispensary) for failed image loads ensures the UI remains polished and meaningful even when assets are missing.
**Action:** Always wrap icon-only buttons in `Tooltip` components and provide descriptive `aria-label` attributes. Implement `onError` handlers on product images to show high-quality fallback icons.

## 2025-01-24 - [Precise Labeling for Quantity Controls]
**Learning:** When labeling increment/decrement controls, using precise action verbs like "Increase" and "Decrease" is more intuitive than generic terms like "Add" or "Remove," particularly when a separate "Delete" (trash) action is present. This distinction prevents user confusion and ensures screen reader users understand whether they are adjusting a value or removing the entire item.
**Action:** Use "Increase/Decrease" for quantity adjustment buttons and reserve "Delete/Remove" for the final removal of an item from a list or cart.
