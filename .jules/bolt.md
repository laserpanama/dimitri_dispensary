## 2025-05-15 - [Database Roundtrip Optimization in Order Creation]
**Learning:** The `orders.create` mutation was performing 2N+1 database queries (fetching products and inserting items in loops). By implementing batch fetching with `inArray` and bulk insertion of items within a single database transaction, the roundtrips were reduced to essentially one atomic operation. This not only improves performance but also ensures data integrity.
**Action:** Always look for loops containing database queries (N+1 problems) and refactor them to use batch operations (`inArray`, bulk `insert`) and transactions.

## 2025-05-16 - [Database Indexing for Common Query Paths]
**Learning:** Identifying frequently queried foreign keys (e.g., `userId` in `orders`, `appointments`, `notifications`) and filtering columns (e.g., `category` in `products`) and adding explicit MySQL indexes significantly improves query performance by avoiding full table scans (converting O(N) operations to O(log N)).
**Action:** Always verify schema definitions and query patterns to ensure all columns used in `WHERE` clauses, `JOIN` conditions, or `ORDER BY` clauses are properly indexed. Use descriptive naming conventions (e.g., `table_column_idx`) for maintainability.

## 2025-05-17 - [Optimizing React Render Cycles and Query Stability]
**Learning:** The `Cart.tsx` page was suffering from redundant render cycles and unnecessary re-fetches. By replacing `useEffect` + `useState` with `useMemo` for the product lookup table, an entire extra render cycle was eliminated. Furthermore, stabilizing the `cartProductIds` dependency using a sorted joined string (`ids.sort().join(',')`) ensured that the array reference remained stable even when item quantities changed, preventing redundant tRPC query executions. Finally, memoizing the total price calculation prevented expensive recalculations during unrelated state updates (like typing in a text field).
**Action:** Prefer `useMemo` over `useEffect` + `useState` for deriving data from query results. Always stabilize array dependencies in hooks using primitive representations to prevent unnecessary re-computations or re-fetches.
