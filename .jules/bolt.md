## 2025-05-15 - [Database Roundtrip Optimization in Order Creation]
**Learning:** The `orders.create` mutation was performing 2N+1 database queries (fetching products and inserting items in loops). By implementing batch fetching with `inArray` and bulk insertion of items within a single database transaction, the roundtrips were reduced to essentially one atomic operation. This not only improves performance but also ensures data integrity.
**Action:** Always look for loops containing database queries (N+1 problems) and refactor them to use batch operations (`inArray`, bulk `insert`) and transactions.

## 2025-05-16 - [Database Indexing for Common Query Paths]
**Learning:** Identifying frequently queried foreign keys (e.g., `userId` in `orders`, `appointments`, `notifications`) and filtering columns (e.g., `category` in `products`) and adding explicit MySQL indexes significantly improves query performance by avoiding full table scans (converting O(N) operations to O(log N)).
**Action:** Always verify schema definitions and query patterns to ensure all columns used in `WHERE` clauses, `JOIN` conditions, or `ORDER BY` clauses are properly indexed. Use descriptive naming conventions (e.g., `table_column_idx`) for maintainability.

## 2025-05-22 - [Frontend Rendering and Navigation Optimization in Cart]
**Learning:** Using `useState` + `useEffect` to derive state from tRPC query results causes a redundant extra render cycle. Furthermore, passing an array of IDs to a query hook can trigger unnecessary re-fetches if the array reference changes but the content doesn't. Switching to `useMemo` for derived data and using a sorted join string as a dependency key stabilizes references and improves efficiency. Additionally, client-side navigation (`setLocation`) is significantly faster than full page reloads (`window.location.href`).
**Action:** Prefer `useMemo` over `useEffect` for deriving data from query results. Always stabilize array dependencies in hooks using primitive join keys. Use client-side routing for internal navigation to avoid unnecessary page reloads.
