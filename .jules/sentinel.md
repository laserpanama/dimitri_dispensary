## 2025-05-23 - IP Spoofing in Age Verification
**Vulnerability:** The `ageVerification.verify` procedure accepted an optional `ipAddress` from the client input, allowing users to spoof their location/identity during a legally sensitive process.
**Learning:** Even when using tRPC with Zod schemas, accepting identity-related data (like IP or User ID) from the client that can be determined server-side is a major security risk.
**Prevention:** Always resolve client metadata (IP, user session) from the request context and headers on the server. Use Express `trust proxy` when behind a load balancer to ensure `req.ip` is accurate.
