## 2025-05-15 - [Optimization of N+1 DB calls in Order Creation]
**Learning:** The order creation process was performing multiple database roundtrips (N+1 for product validation and N for item insertion). Using a bulk fetch with `inArray`, an in-memory Map for validation, and a bulk insert within a transaction significantly reduces the load on the database and improves latency.
**Action:** Always look for loops containing database queries in mutation procedures and replace them with bulk operations and in-memory processing.
