## 2025-05-15 - [React List Re-render Optimization]
**Learning:** In components with both a large list (like chat messages) and a frequently updated state (like an input field), every keystroke in the input triggers a full re-render of the list. Extracting the list into a separate component wrapped in `React.memo` prevents these unnecessary re-renders, significantly improving typing responsiveness.
**Action:** Always identify "hot paths" where frequent state updates (typing, sliders, etc.) occur near expensive-to-render components and apply memoization.
