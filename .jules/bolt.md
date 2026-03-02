## 2025-05-15 - [Database Roundtrip Optimization in Order Creation]
**Learning:** The `orders.create` mutation was performing 2N+1 database queries (fetching products and inserting items in loops). By implementing batch fetching with `inArray` and bulk insertion of items within a single database transaction, the roundtrips were reduced to essentially one atomic operation. This not only improves performance but also ensures data integrity.
**Action:** Always look for loops containing database queries (N+1 problems) and refactor them to use batch operations (`inArray`, bulk `insert`) and transactions.

## 2025-05-20 - [Targeted Data Fetching and Indexing]
**Learning:** Fetching the entire product catalog for the Shopping Cart was a major bottleneck. Replacing it with a targeted `getByIds` query significantly reduced payload size and client processing. Additionally, adding explicit MySQL indexes for foreign keys and frequently filtered columns (like `category`) is crucial for maintaining performance as the dataset grows.
**Action:** Always check if a "list all" query can be replaced by a more specific fetch, and ensure all columns used in `WHERE` clauses or `JOIN`s have appropriate indexes.
