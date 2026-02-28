## 2025-05-15 - [Database Roundtrip Optimization in Order Creation]
**Learning:** The `orders.create` mutation was performing 2N+1 database queries (fetching products and inserting items in loops). By implementing batch fetching with `inArray` and bulk insertion of items within a single database transaction, the roundtrips were reduced to essentially one atomic operation. This not only improves performance but also ensures data integrity.
**Action:** Always look for loops containing database queries (N+1 problems) and refactor them to use batch operations (`inArray`, bulk `insert`) and transactions.

## 2025-05-15 - [Frontend Data Fetching Optimization in Cart Page]
**Learning:** Fetching the entire product catalog on the Cart page is inefficient as the catalog grows. Targeted fetching using specific IDs via a new tRPC procedure significantly reduces payload size. Additionally, initializing state from localStorage during  (instead of ) prevents an initial empty render and allows for immediate query enablement.
**Action:** Use targeted queries (e.g., `getByIds`) for pages that only need a subset of data, and prefer `useMemo` over `useEffect` for deriving lookup maps from query data.

## 2025-05-15 - [Frontend Data Fetching Optimization in Cart Page]
**Learning:** Fetching the entire product catalog on the Cart page is inefficient as the catalog grows. Targeted fetching using specific IDs via a new tRPC procedure significantly reduces payload size. Additionally, initializing state from localStorage during `useState` (instead of `useEffect`) prevents an initial empty render and allows for immediate query enablement.
**Action:** Use targeted queries (e.g., `getByIds`) for pages that only need a subset of data, and prefer `useMemo` over `useEffect` for deriving lookup maps from query data.
