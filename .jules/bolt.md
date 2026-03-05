## 2025-05-15 - [Database Roundtrip Optimization in Order Creation]
**Learning:** The `orders.create` mutation was performing 2N+1 database queries (fetching products and inserting items in loops). By implementing batch fetching with `inArray` and bulk insertion of items within a single database transaction, the roundtrips were reduced to essentially one atomic operation. This not only improves performance but also ensures data integrity.
**Action:** Always look for loops containing database queries (N+1 problems) and refactor them to use batch operations (`inArray`, bulk `insert`) and transactions.

## 2025-05-22 - [Optimized Cart Product Fetching and Memoization]
**Learning:** Initializing state from `localStorage` in the render body or `useEffect` causes redundant reads and renders. Using a lazy initializer for `useState` ensures the disk read only happens once. Additionally, replacing a full product list fetch with a targeted `getByIds` query significantly reduces payload size and processing time when the cart contains only a few items. Memoizing derived data like lookup maps and totals prevents expensive O(N) operations on every render.
**Action:** Use lazy state initialization for expensive initial values (like `localStorage`). Implement targeted tRPC/API queries instead of fetching all data. Memoize expensive derivations using `useMemo`.
