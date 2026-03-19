## 2025-05-15 - [Database Roundtrip Optimization in Order Creation]
**Learning:** The `orders.create` mutation was performing 2N+1 database queries (fetching products and inserting items in loops). By implementing batch fetching with `inArray` and bulk insertion of items within a single database transaction, the roundtrips were reduced to essentially one atomic operation. This not only improves performance but also ensures data integrity.
**Action:** Always look for loops containing database queries (N+1 problems) and refactor them to use batch operations (`inArray`, bulk `insert`) and transactions.

## 2025-05-16 - [Database Indexing for Common Query Paths]
**Learning:** Identifying frequently queried foreign keys (e.g., `userId` in `orders`, `appointments`, `notifications`) and filtering columns (e.g., `category` in `products`) and adding explicit MySQL indexes significantly improves query performance by avoiding full table scans (converting O(N) operations to O(log N)).
**Action:** Always verify schema definitions and query patterns to ensure all columns used in `WHERE` clauses, `JOIN` conditions, or `ORDER BY` clauses are properly indexed. Use descriptive naming conventions (e.g., `table_column_idx`) for maintainability.

## 2025-05-17 - [Optimizing Component Performance with useMemo for Derived State]
**Learning:** In `Cart.tsx`, using `useEffect` and `useState` to sync tRPC query data into a local lookup object caused redundant render cycles. By switching to `useMemo`, the lookup object is derived directly from the query data during the render phase, eliminating unnecessary state updates. Additionally, memoizing expensive calculations like the cart total prevents recalculation on every minor state change (e.g., user typing in a text field).
**Action:** Prefer deriving state with `useMemo` over `useEffect` + `useState` for transformation of props or query data. Memoize expensive computations that depend on stable data to maintain UI performance.
