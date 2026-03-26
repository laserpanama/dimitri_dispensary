## 2025-05-15 - [Database Roundtrip Optimization in Order Creation]
**Learning:** The `orders.create` mutation was performing 2N+1 database queries (fetching products and inserting items in loops). By implementing batch fetching with `inArray` and bulk insertion of items within a single database transaction, the roundtrips were reduced to essentially one atomic operation. This not only improves performance but also ensures data integrity.
**Action:** Always look for loops containing database queries (N+1 problems) and refactor them to use batch operations (`inArray`, bulk `insert`) and transactions.

## 2025-05-16 - [Database Indexing for Common Query Paths]
**Learning:** Identifying frequently queried foreign keys (e.g., `userId` in `orders`, `appointments`, `notifications`) and filtering columns (e.g., `category` in `products`) and adding explicit MySQL indexes significantly improves query performance by avoiding full table scans (converting O(N) operations to O(log N)).
**Action:** Always verify schema definitions and query patterns to ensure all columns used in `WHERE` clauses, `JOIN` conditions, or `ORDER BY` clauses are properly indexed. Use descriptive naming conventions (e.g., `table_column_idx`) for maintainability.

## 2025-05-17 - [React Render Optimization in Shopping Cart]
**Learning:** Stabilizing dependency keys for data fetching (e.g., using a sorted join-key string for an array of IDs) prevents redundant network requests and re-renders when the content of the array hasn't logically changed (e.g., only item quantities updated). Additionally, replacing `useState` + `useEffect` with `useMemo` for derived data like lookup tables eliminates redundant render cycles.
**Action:** Always memoize arrays or objects used as dependencies in hooks or API calls. Prefer `useMemo` for deriving state from existing data to ensure UI consistency and minimize render passes.
