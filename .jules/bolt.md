## 2025-05-15 - [Database Roundtrip Optimization in Order Creation]
**Learning:** The `orders.create` mutation was performing 2N+1 database queries (fetching products and inserting items in loops). By implementing batch fetching with `inArray` and bulk insertion of items within a single database transaction, the roundtrips were reduced to essentially one atomic operation. This not only improves performance but also ensures data integrity.
**Action:** Always look for loops containing database queries (N+1 problems) and refactor them to use batch operations (`inArray`, bulk `insert`) and transactions.

## 2025-05-16 - [Database Indexing for Common Query Paths]
**Learning:** Identifying frequently queried foreign keys (e.g., `userId` in `orders`, `appointments`, `notifications`) and filtering columns (e.g., `category` in `products`) and adding explicit MySQL indexes significantly improves query performance by avoiding full table scans (converting O(N) operations to O(log N)).
**Action:** Always verify schema definitions and query patterns to ensure all columns used in `WHERE` clauses, `JOIN` conditions, or `ORDER BY` clauses are properly indexed. Use descriptive naming conventions (e.g., `table_column_idx`) for maintainability.

## 2025-05-17 - [Optimizing Component Renders and Data Fetching in Cart]
**Learning:** In the `Cart` component, deriving a product lookup table using `useEffect` + `useState` caused an unnecessary second render cycle after data was fetched. Additionally, `useMemo` for product IDs was being re-computed too frequently because the `cartItems` array reference changed whenever any quantity was updated, even if the set of IDs remained the same.
**Action:** Prefer `useMemo` over `useEffect` + `useState` for deriving state from fetched data to eliminate redundant renders. To stabilize dependencies that rely on array contents rather than references, use a stringified version of the array (e.g., `join(',')`) in the dependency array.
