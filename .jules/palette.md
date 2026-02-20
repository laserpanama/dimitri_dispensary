## 2025-05-22 - [Accessibility pattern for icon-only buttons]
**Learning:** Icon-only buttons in this app (e.g., `ChatWidget`, `ProductCard`) frequently lack `aria-label` attributes, making them inaccessible to screen readers. `title` attributes are insufficient as they aren't consistently read by assistive technology and don't provide a persistent visual hint.
**Action:** Always use `aria-label` for icon-only buttons and wrap them in a `Tooltip` component (provided by the global `TooltipProvider` in `App.tsx`) to provide both accessibility and visual affordance.

## 2025-05-22 - [Component Consistency]
**Learning:** The application has a set of themed UI components in `@/components/ui` (e.g., `Button`, `Input`) that provide consistent styling and better default accessibility (like focus rings) than raw HTML elements.
**Action:** Prefer using the library's `Button` and `Input` components over raw `<button>` and `<input>` tags to maintain visual and behavioral consistency.
