## 2025-05-15 - [Database Roundtrip Optimization in Order Creation]
**Learning:** The `orders.create` mutation was performing 2N+1 database queries (fetching products and inserting items in loops). By implementing batch fetching with `inArray` and bulk insertion of items within a single database transaction, the roundtrips were reduced to essentially one atomic operation. This not only improves performance but also ensures data integrity.
**Action:** Always look for loops containing database queries (N+1 problems) and refactor them to use batch operations (`inArray`, bulk `insert`) and transactions.

## 2025-05-15 - [Database Query Performance Optimization with Explicit Indexes]
**Learning:** While foreign keys and categories are frequently used in `where` clauses (e.g., `userId`, `orderId`, `category`), they aren't automatically indexed in many database configurations unless explicitly defined in the schema. Adding these indexes transforms sequential scans (O(N)) into index seeks (O(log N)), which is critical for maintaining performance as the database grows.
**Action:** Review the schema for columns used in common filters, joins, and ordering operations and ensure they have explicit indexes defined in the `mysqlTable` callback.
