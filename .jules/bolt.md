## 2025-05-15 - [Database Roundtrip Optimization in Order Creation]
**Learning:** The `orders.create` mutation was performing 2N+1 database queries (fetching products and inserting items in loops). By implementing batch fetching with `inArray` and bulk insertion of items within a single database transaction, the roundtrips were reduced to essentially one atomic operation. This not only improves performance but also ensures data integrity.
**Action:** Always look for loops containing database queries (N+1 problems) and refactor them to use batch operations (`inArray`, bulk `insert`) and transactions.

## 2025-05-16 - [Database Indexing for Common Query Paths]
**Learning:** Identifying frequently queried foreign keys (e.g., `userId` in `orders`, `appointments`, `notifications`) and filtering columns (e.g., `category` in `products`) and adding explicit MySQL indexes significantly improves query performance by avoiding full table scans (converting O(N) operations to O(log N)).
**Action:** Always verify schema definitions and query patterns to ensure all columns used in `WHERE` clauses, `JOIN` conditions, or `ORDER BY` clauses are properly indexed. Use descriptive naming conventions (e.g., `table_column_idx`) for maintainability.

## 2025-05-17 - [Frontend Render Cycle Optimization]
**Learning:** The `useState` + `useEffect` pattern for transforming data (e.g., creating a lookup map from a fetch result) introduces an unnecessary extra render cycle. Using `useMemo` for such transformations ensures the data is ready during the initial render where the fetch dependency resolves. Additionally, memoizing leaf components like `ProductCard` and using stable function references (`usePersistFn`) prevents O(N) re-renders in large lists when parent state changes.
**Action:** Always use `useMemo` for derived data or transformations instead of `useEffect`. Use `React.memo` for list items and `usePersistFn` for callbacks passed to them to maintain render stability.
