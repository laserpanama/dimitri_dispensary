## 2025-05-15 - [Database Roundtrip Optimization in Order Creation]
**Learning:** The `orders.create` mutation was performing 2N+1 database queries (fetching products and inserting items in loops). By implementing batch fetching with `inArray` and bulk insertion of items within a single database transaction, the roundtrips were reduced to essentially one atomic operation. This not only improves performance but also ensures data integrity.
**Action:** Always look for loops containing database queries (N+1 problems) and refactor them to use batch operations (`inArray`, bulk `insert`) and transactions.

## 2026-02-25 - [Database Indexing for Scalable Reads]
**Learning:** Several frequently queried columns (foreign keys like userId, category, orderId, conversationId) were missing indexes in the Drizzle schema. This would lead to full table scans as the database grows, significantly degrading performance for common operations like fetching a user's orders or filtering products by category.
**Action:** Always verify that foreign keys and columns used in WHERE clauses or JOINs have explicit indexes in the schema. In Drizzle for MySQL, use the third argument of mysqlTable with the index() helper.
