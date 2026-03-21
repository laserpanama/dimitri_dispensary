## 2025-05-15 - [Database Roundtrip Optimization in Order Creation]
**Learning:** The `orders.create` mutation was performing 2N+1 database queries (fetching products and inserting items in loops). By implementing batch fetching with `inArray` and bulk insertion of items within a single database transaction, the roundtrips were reduced to essentially one atomic operation. This not only improves performance but also ensures data integrity.
**Action:** Always look for loops containing database queries (N+1 problems) and refactor them to use batch operations (`inArray`, bulk `insert`) and transactions.

## 2025-05-16 - [Database Indexing for Common Query Paths]
**Learning:** Identifying frequently queried foreign keys (e.g., `userId` in `orders`, `appointments`, `notifications`) and filtering columns (e.g., `category` in `products`) and adding explicit MySQL indexes significantly improves query performance by avoiding full table scans (converting O(N) operations to O(log N)).
**Action:** Always verify schema definitions and query patterns to ensure all columns used in `WHERE` clauses, `JOIN` conditions, or `ORDER BY` clauses are properly indexed. Use descriptive naming conventions (e.g., `table_column_idx`) for maintainability.

## 2025-05-20 - [React Component Optimization in Cart.tsx]
**Learning:** Redundant state synchronization (`useEffect` + `useState`) for derived data from tRPC queries causes unnecessary re-render cycles (initial render with empty state -> data fetch -> useEffect trigger -> state update -> final render). Replacing this with `useMemo` allows the component to derive data synchronously during the render phase once the query data is available.
**Action:** Prefer deriving state using `useMemo` over `useEffect` synchronization. Use stable function references (like `usePersistFn`) for event handlers passed to optimized components to prevent redundant downstream updates.
