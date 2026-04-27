## 2025-05-15 - [Database Roundtrip Optimization in Order Creation]
**Learning:** The `orders.create` mutation was performing 2N+1 database queries (fetching products and inserting items in loops). By implementing batch fetching with `inArray` and bulk insertion of items within a single database transaction, the roundtrips were reduced to essentially one atomic operation. This not only improves performance but also ensures data integrity.
**Action:** Always look for loops containing database queries (N+1 problems) and refactor them to use batch operations (`inArray`, bulk `insert`) and transactions.

## 2025-05-16 - [Database Indexing for Common Query Paths]
**Learning:** Identifying frequently queried foreign keys (e.g., `userId` in `orders`, `appointments`, `notifications`) and filtering columns (e.g., `category` in `products`) and adding explicit MySQL indexes significantly improves query performance by avoiding full table scans (converting O(N) operations to O(log N)).
**Action:** Always verify schema definitions and query patterns to ensure all columns used in `WHERE` clauses, `JOIN` conditions, or `ORDER BY` clauses are properly indexed. Use descriptive naming conventions (e.g., `table_column_idx`) for maintainability.

## 2025-05-23 - [React Memoization in Cart Page]
**Learning:** The `Cart.tsx` component was using a `useState` + `useEffect` pattern to derive a lookup map from fetched data, causing an unnecessary extra render cycle. By switching to `useMemo` for both the lookup map and the total calculation, we eliminated redundant renders and ensured that unrelated state updates (like fulfillment type or address) don't trigger expensive re-computations of the cart total.
**Action:** Prefer deriving data with `useMemo` over syncing it with `useState` and `useEffect` whenever possible to keep the component lifecycle lean and efficient.
