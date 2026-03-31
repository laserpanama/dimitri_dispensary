## 2025-05-15 - [Database Roundtrip Optimization in Order Creation]
**Learning:** The `orders.create` mutation was performing 2N+1 database queries (fetching products and inserting items in loops). By implementing batch fetching with `inArray` and bulk insertion of items within a single database transaction, the roundtrips were reduced to essentially one atomic operation. This not only improves performance but also ensures data integrity.
**Action:** Always look for loops containing database queries (N+1 problems) and refactor them to use batch operations (`inArray`, bulk `insert`) and transactions.

## 2025-05-16 - [Database Indexing for Common Query Paths]
**Learning:** Identifying frequently queried foreign keys (e.g., `userId` in `orders`, `appointments`, `notifications`) and filtering columns (e.g., `category` in `products`) and adding explicit MySQL indexes significantly improves query performance by avoiding full table scans (converting O(N) operations to O(log N)).
**Action:** Always verify schema definitions and query patterns to ensure all columns used in `WHERE` clauses, `JOIN` conditions, or `ORDER BY` clauses are properly indexed. Use descriptive naming conventions (e.g., `table_column_idx`) for maintainability.

## 2025-05-20 - [Stable Dependency Keys for Memoized Arrays]
**Learning:** In React, using an array as a `useMemo` or `useEffect` dependency often causes redundant executions because array references change on every render, even if the content is the same. Stabilizing the dependency key by using a sorted, joined string (e.g., `ids.sort().join(',')`) ensures the hook only re-runs when the actual IDs change, preventing unnecessary tRPC fetches and re-renders.
**Action:** For array-based dependencies, always evaluate if the reference is stable. If not, use a stringified or joined key to represent the array's identity.

## 2025-05-20 - [Deriving Lookup Tables from Query Data]
**Learning:** Using `useEffect` to sync tRPC query results into a local `useState` for lookup tables creates an extra render cycle (Query Success -> State Update -> Render). Directly deriving the lookup table using `useMemo` from the query's `data` property eliminates this redundant step and keeps the UI in sync with the source of truth more efficiently.
**Action:** Prefer `useMemo` for transforming query data into specialized formats (like maps or lookups) over `useEffect` + `useState`.
