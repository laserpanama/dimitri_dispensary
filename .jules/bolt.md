## 2025-05-15 - [Database Roundtrip Optimization in Order Creation]
**Learning:** The `orders.create` mutation was performing 2N+1 database queries (fetching products and inserting items in loops). By implementing batch fetching with `inArray` and bulk insertion of items within a single database transaction, the roundtrips were reduced to essentially one atomic operation. This not only improves performance but also ensures data integrity.
**Action:** Always look for loops containing database queries (N+1 problems) and refactor them to use batch operations (`inArray`, bulk `insert`) and transactions.

## 2025-05-16 - [Database Indexing for Common Query Paths]
**Learning:** Identifying frequently queried foreign keys (e.g., `userId` in `orders`, `appointments`, `notifications`) and filtering columns (e.g., `category` in `products`) and adding explicit MySQL indexes significantly improves query performance by avoiding full table scans (converting O(N) operations to O(log N)).
**Action:** Always verify schema definitions and query patterns to ensure all columns used in `WHERE` clauses, `JOIN` conditions, or `ORDER BY` clauses are properly indexed. Use descriptive naming conventions (e.g., `table_column_idx`) for maintainability.

## 2026-03-23 - [Cart Render and Fetch Efficiency]
**Learning:** The cart component suffered from redundant tRPC re-fetches and an extra render cycle. By stabilizing the query dependency with a sorted join key and replacing a state-effect pattern with `useMemo` for the product lookup, we eliminated these inefficiencies. Transitioning to client-side navigation with `setLocation` also avoided expensive full page reloads.
**Action:** Use stable dependency keys for queries to prevent redundant network traffic. Always prefer deriving state with `useMemo` over `useState` + `useEffect` to minimize render cycles. Use client-side routing for smoother transitions.
