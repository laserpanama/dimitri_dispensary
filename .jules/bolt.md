## 2025-05-15 - [Database Roundtrip Optimization in Order Creation]
**Learning:** The `orders.create` mutation was performing 2N+1 database queries (fetching products and inserting items in loops). By implementing batch fetching with `inArray` and bulk insertion of items within a single database transaction, the roundtrips were reduced to essentially one atomic operation. This not only improves performance but also ensures data integrity.
**Action:** Always look for loops containing database queries (N+1 problems) and refactor them to use batch operations (`inArray`, bulk `insert`) and transactions.

## 2025-05-16 - [Database Indexing for Common Query Paths]
**Learning:** Identifying frequently queried foreign keys (e.g., `userId` in `orders`, `appointments`, `notifications`) and filtering columns (e.g., `category` in `products`) and adding explicit MySQL indexes significantly improves query performance by avoiding full table scans (converting O(N) operations to O(log N)).
**Action:** Always verify schema definitions and query patterns to ensure all columns used in `WHERE` clauses, `JOIN` conditions, or `ORDER BY` clauses are properly indexed. Use descriptive naming conventions (e.g., `table_column_idx`) for maintainability.

## 2026-03-24 - [Cart Performance Optimization via Memoization and Hook Stability]
**Learning:** In `Cart.tsx`, unnecessary re-fetches and render cycles were caused by unstable query dependencies and manual state management (useEffect + useState). By stabilizing the query key with a sorted ID string and deriving the lookup table directly from query data via `useMemo`, redundant operations were eliminated.
**Action:** Prefer deriving state from props or other state using `useMemo` over `useEffect` + `useState` to maintain UI consistency and eliminate redundant render cycles. Use stable join keys for array-based hook dependencies.
