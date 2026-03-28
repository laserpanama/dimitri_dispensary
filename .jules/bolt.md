## 2025-05-15 - [Database Roundtrip Optimization in Order Creation]
**Learning:** The `orders.create` mutation was performing 2N+1 database queries (fetching products and inserting items in loops). By implementing batch fetching with `inArray` and bulk insertion of items within a single database transaction, the roundtrips were reduced to essentially one atomic operation. This not only improves performance but also ensures data integrity.
**Action:** Always look for loops containing database queries (N+1 problems) and refactor them to use batch operations (`inArray`, bulk `insert`) and transactions.

## 2025-05-16 - [Database Indexing for Common Query Paths]
**Learning:** Identifying frequently queried foreign keys (e.g., `userId` in `orders`, `appointments`, `notifications`) and filtering columns (e.g., `category` in `products`) and adding explicit MySQL indexes significantly improves query performance by avoiding full table scans (converting O(N) operations to O(log N)).
**Action:** Always verify schema definitions and query patterns to ensure all columns used in `WHERE` clauses, `JOIN` conditions, or `ORDER BY` clauses are properly indexed. Use descriptive naming conventions (e.g., `table_column_idx`) for maintainability.

## 2025-05-17 - [Redundant Render and Network Fetch Optimization]
**Learning:** In the `Cart` component, `cartProductIds` was being recalculated on every render, and its reference was changing because `.map()` creates a new array. By stabilizing this reference using a sorted join key string in the dependency array, we prevent redundant tRPC `getByIds` re-fetches when only quantities (not product IDs) change. Additionally, replacing `useState`/`useEffect` with `useMemo` for derived data (like the product lookup table) eliminates extra render cycles upon data fetch.
**Action:** Use memoized derived data instead of syncing state with effects. For array dependencies in hooks, consider using a stable primitive (like a join string) if the array contents are what matter.
