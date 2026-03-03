## 2025-05-15 - IP Spoofing in Age Verification
**Vulnerability:** The `ageVerification.verify` tRPC procedure accepted an `ipAddress` directly from client-side input, allowing users to spoof their origin for compliance records.
**Learning:** Security-critical metadata should never be trusted from client input. Express `req.ip` is only reliable when `trust proxy` is correctly configured to match the deployment environment.
**Prevention:** Remove client-side input for server-side metadata and use `app.set("trust proxy", 1)` in Express to securely resolve the real client IP from trusted headers provided by the infrastructure.
