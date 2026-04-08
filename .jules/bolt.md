## 2025-05-15 - [Database Roundtrip Optimization in Order Creation]
**Learning:** The `orders.create` mutation was performing 2N+1 database queries (fetching products and inserting items in loops). By implementing batch fetching with `inArray` and bulk insertion of items within a single database transaction, the roundtrips were reduced to essentially one atomic operation. This not only improves performance but also ensures data integrity.
**Action:** Always look for loops containing database queries (N+1 problems) and refactor them to use batch operations (`inArray`, bulk `insert`) and transactions.

## 2025-05-16 - [Database Indexing for Common Query Paths]
**Learning:** Identifying frequently queried foreign keys (e.g., `userId` in `orders`, `appointments`, `notifications`) and filtering columns (e.g., `category` in `products`) and adding explicit MySQL indexes significantly improves query performance by avoiding full table scans (converting O(N) operations to O(log N)).
**Action:** Always verify schema definitions and query patterns to ensure all columns used in `WHERE` clauses, `JOIN` conditions, or `ORDER BY` clauses are properly indexed. Use descriptive naming conventions (e.g., `table_column_idx`) for maintainability.

## 2026-04-08 - [Redundant Re-renders from State-Effect Syncing]
**Learning:** Using `useEffect` + `useState` to derive a lookup map from a query result (like in `Cart.tsx`) causes a redundant re-render: one for the query completion and one for the state update. Replacing this with `useMemo` computes the derived data synchronously during render and avoids the extra commit phase.
**Action:** Always prefer `useMemo` for deriving data from props or query results. Only use `useState` + `useEffect` if the derivation needs to be asynchronous or has side effects.

## 2026-04-08 - [List Rendering Optimization with React.memo and Stable References]
**Learning:** Large lists of components (like `ProductCard`) can significantly degrade performance if every item re-renders when the parent does. Combining `React.memo` on the child with stable function references (via `usePersistFn` or `useCallback`) in the parent ensures that only changed items re-render.
**Action:** Memoize list items and ensure all props passed to them (especially callbacks) have stable references.
