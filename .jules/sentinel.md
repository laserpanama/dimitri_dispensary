## 2025-05-22 - Client-Side IP Spoofing in Age Verification
**Vulnerability:** The `ageVerification.verify` procedure accepted `ipAddress` as an optional input from the client, allowing users to spoof their location or identity in compliance logs.
**Learning:** Procedures requiring client identifiers (like IP) should resolve them server-side from the request context rather than trusting client-provided input in the schema.
**Prevention:** Remove client-provided overrides for server-resolvable metadata. Ensure `app.set("trust proxy", 1)` is enabled in Express when behind a load balancer so `req.ip` is accurate.
