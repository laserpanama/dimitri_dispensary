## 2025-05-15 - [Database Roundtrip Optimization in Order Creation]
**Learning:** The `orders.create` mutation was performing 2N+1 database queries (fetching products and inserting items in loops). By implementing batch fetching with `inArray` and bulk insertion of items within a single database transaction, the roundtrips were reduced to essentially one atomic operation. This not only improves performance but also ensures data integrity.
**Action:** Always look for loops containing database queries (N+1 problems) and refactor them to use batch operations (`inArray`, bulk `insert`) and transactions.

## 2025-05-16 - [Database Indexing for Common Query Paths]
**Learning:** Identifying frequently queried foreign keys (e.g., `userId` in `orders`, `appointments`, `notifications`) and filtering columns (e.g., `category` in `products`) and adding explicit MySQL indexes significantly improves query performance by avoiding full table scans (converting O(N) operations to O(log N)).
**Action:** Always verify schema definitions and query patterns to ensure all columns used in `WHERE` clauses, `JOIN` conditions, or `ORDER BY` clauses are properly indexed. Use descriptive naming conventions (e.g., `table_column_idx`) for maintainability.

## 2025-05-17 - [Eliminating Redundant Render Cycles in React Components]
**Learning:** Using `useState` and `useEffect` to derive state from a prop or another state (like a product lookup map from fetched data) causes an unnecessary extra render cycle. The component first renders with empty state, then `useEffect` triggers, updates state, and forces a second render. Replacing this pattern with `useMemo` allows the derivation to happen synchronously during the first render after data is available.
**Action:** Prefer `useMemo` over `useState`/`useEffect` for deriving or transforming data that depends on other state or props to minimize re-renders and improve UI responsiveness.
