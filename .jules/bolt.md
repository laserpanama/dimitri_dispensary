## 2025-05-15 - [Database Roundtrip Optimization in Order Creation]
**Learning:** The `orders.create` mutation was performing 2N+1 database queries (fetching products and inserting items in loops). By implementing batch fetching with `inArray` and bulk insertion of items within a single database transaction, the roundtrips were reduced to essentially one atomic operation. This not only improves performance but also ensures data integrity.
**Action:** Always look for loops containing database queries (N+1 problems) and refactor them to use batch operations (`inArray`, bulk `insert`) and transactions.

## 2025-05-16 - [Database Indexing for Common Query Paths]
**Learning:** Identifying frequently queried foreign keys (e.g., `userId` in `orders`, `appointments`, `notifications`) and filtering columns (e.g., `category` in `products`) and adding explicit MySQL indexes significantly improves query performance by avoiding full table scans (converting O(N) operations to O(log N)).
**Action:** Always verify schema definitions and query patterns to ensure all columns used in `WHERE` clauses, `JOIN` conditions, or `ORDER BY` clauses are properly indexed. Use descriptive naming conventions (e.g., `table_column_idx`) for maintainability.

## 2026-03-18 - [SPA Navigation and Derived State Optimization in Cart]
**Learning:** Using `window.location.href` for navigation in a SPA causes a full page reload, which is significantly slower than using a router's `setLocation`. Additionally, deriving lookup tables from query data using `useMemo` instead of `useState` + `useEffect` eliminates redundant render cycles and improves UI consistency.
**Action:** Always prefer router-based navigation (`setLocation`) over full page reloads and use `useMemo` to derive state from props or query data to minimize render passes.
