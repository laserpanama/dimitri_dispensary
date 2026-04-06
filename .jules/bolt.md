## 2025-05-15 - [Database Roundtrip Optimization in Order Creation]
**Learning:** The `orders.create` mutation was performing 2N+1 database queries (fetching products and inserting items in loops). By implementing batch fetching with `inArray` and bulk insertion of items within a single database transaction, the roundtrips were reduced to essentially one atomic operation. This not only improves performance but also ensures data integrity.
**Action:** Always look for loops containing database queries (N+1 problems) and refactor them to use batch operations (`inArray`, bulk `insert`) and transactions.

## 2025-05-16 - [Database Indexing for Common Query Paths]
**Learning:** Identifying frequently queried foreign keys (e.g., `userId` in `orders`, `appointments`, `notifications`) and filtering columns (e.g., `category` in `products`) and adding explicit MySQL indexes significantly improves query performance by avoiding full table scans (converting O(N) operations to O(log N)).
**Action:** Always verify schema definitions and query patterns to ensure all columns used in `WHERE` clauses, `JOIN` conditions, or `ORDER BY` clauses are properly indexed. Use descriptive naming conventions (e.g., `table_column_idx`) for maintainability.

## 2025-05-17 - [React Component Optimization with useMemo and Client-Side Navigation]
**Learning:** Using `useState` + `useEffect` to derive state from props or fetched data causes an unnecessary additional render cycle. Replacing this pattern with `useMemo` allows for synchronous derivation during the initial render, improving UI responsiveness. Additionally, using `window.location.href` in an SPA triggers a full browser reload; switching to `useLocation` (from `wouter`) provides near-instantaneous client-side transitions.
**Action:** For derived data, always prefer `useMemo` over `useState` + `useEffect`. Always use the application's routing framework for internal navigation to avoid expensive full-page reloads.
