## 2025-05-15 - [Database Roundtrip Optimization in Order Creation]
**Learning:** The `orders.create` mutation was performing 2N+1 database queries (fetching products and inserting items in loops). By implementing batch fetching with `inArray` and bulk insertion of items within a single database transaction, the roundtrips were reduced to essentially one atomic operation. This not only improves performance but also ensures data integrity.
**Action:** Always look for loops containing database queries (N+1 problems) and refactor them to use batch operations (`inArray`, bulk `insert`) and transactions.

## 2025-05-16 - [Database Indexing for Common Query Paths]
**Learning:** Identifying frequently queried foreign keys (e.g., `userId` in `orders`, `appointments`, `notifications`) and filtering columns (e.g., `category` in `products`) and adding explicit MySQL indexes significantly improves query performance by avoiding full table scans (converting O(N) operations to O(log N)).
**Action:** Always verify schema definitions and query patterns to ensure all columns used in `WHERE` clauses, `JOIN` conditions, or `ORDER BY` clauses are properly indexed. Use descriptive naming conventions (e.g., `table_column_idx`) for maintainability.

## 2025-05-18 - [Derived State Optimization in React]
**Learning:** Using `useState` + `useEffect` to synchronize derived data from a tRPC query (or any async hook) introduces an extra, redundant render cycle. By switching to `useMemo`, the lookup table is calculated during the same render pass the data arrives in, making the UI feel snappier and reducing CPU churn.
**Action:** Always prefer `useMemo` for deriving data structures (like lookup maps) from raw API responses instead of state-syncing effects.

## 2025-05-18 - [Client-side Navigation vs Full Page Reload]
**Learning:** In a single-page application (SPA), using `window.location.href` triggers a full browser reload, discarding the entire React state and re-downloading/re-parsing all assets. Switching to a router-provided `setLocation` or `Link` component preserves the application context and makes transitions instantaneous.
**Action:** Audit the codebase for any remaining uses of native `window.location` for internal navigation and replace them with router-aware alternatives.
