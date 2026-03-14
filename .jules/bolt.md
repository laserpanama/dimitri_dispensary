## 2025-05-15 - [Database Roundtrip Optimization in Order Creation]
**Learning:** The `orders.create` mutation was performing 2N+1 database queries (fetching products and inserting items in loops). By implementing batch fetching with `inArray` and bulk insertion of items within a single database transaction, the roundtrips were reduced to essentially one atomic operation. This not only improves performance but also ensures data integrity.
**Action:** Always look for loops containing database queries (N+1 problems) and refactor them to use batch operations (`inArray`, bulk `insert`) and transactions.

## 2025-05-16 - [Database Indexing for Common Query Paths]
**Learning:** Identifying frequently queried foreign keys (e.g., `userId` in `orders`, `appointments`, `notifications`) and filtering columns (e.g., `category` in `products`) and adding explicit MySQL indexes significantly improves query performance by avoiding full table scans (converting O(N) operations to O(log N)).
**Action:** Always verify schema definitions and query patterns to ensure all columns used in `WHERE` clauses, `JOIN` conditions, or `ORDER BY` clauses are properly indexed. Use descriptive naming conventions (e.g., `table_column_idx`) for maintainability.

## 2026-03-14 - [React Render Cycle Optimization in Shopping Flow]
**Learning:** In the `Cart.tsx` component, using `useState` + `useEffect` to derive a product lookup map from fetched data caused an unnecessary extra render cycle. By switching to `useMemo`, the lookup map is derived during the render phase, eliminating the intermediate "empty" state. Additionally, `window.location.href` triggers a full page reload, which is inefficient in an SPA; `setLocation` from `wouter` provides a much smoother transition.
**Action:** Always prefer deriving state with `useMemo` over `useEffect` when possible to reduce render cycles. Use SPA-native navigation for internal redirects.
