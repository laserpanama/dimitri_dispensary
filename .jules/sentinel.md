## 2025-03-01 - Secure IP Resolution in tRPC
**Vulnerability:** IP spoofing in age verification.
**Learning:** The `ageVerification.verify` procedure accepted `ipAddress` from user input, allowing attackers to bypass IP-based logging or restrictions by providing a fake IP. Relying on `ctx.req.ip` is only safe when `trust proxy` is correctly configured in Express.
**Prevention:** Always resolve security-critical identifiers (like IP addresses or User IDs) server-side from the request context. Remove these from input schemas to prevent spoofing and enforce server-side resolution.
