## 2026-02-22 - [N+1 Query Resolution in Order Creation]
**Learning:** The order creation process was suffering from a classic N+1 bottleneck, performing a database lookup for every product in the order and a separate insertion for every order item. By utilizing Drizzle's `inArray` for bulk fetching and bulk `insert` for order items, database roundtrips were reduced from 2N + 1 to 3.
**Action:** Always look for loops containing database queries or individual insertions, and replace them with bulk operations and transactions for both performance and atomicity.
