## 2025-05-22 - [IP Spoofing and Server Hardening]
**Vulnerability:** The `ageVerification.verify` procedure accepted a client-provided `ipAddress`, which could be spoofed. Additionally, the Express server was missing standard security headers and exposed the `X-Powered-By` header.
**Learning:** Even when using tRPC, sensitive metadata like IP addresses should be resolved server-side from trusted sources (like `req.ip` with `trust proxy` enabled) rather than accepted as input. Relying on `x-forwarded-for` manually without `trust proxy` can also be risky or inconsistent.
**Prevention:** Always use server-side session/request properties for security-critical data. Harden Express servers by default with `app.disable("x-powered-by")` and essential security headers. Ensure tests mock the full context required by these security measures (e.g., adding `ip` to mock requests).

## 2025-05-23 - [Inconsistent Access Control and Missing Payload Limits]
**Vulnerability:** The Chat API had inconsistent role-based access control (RBAC), with some administrative procedures using manual role checks instead of standardized middleware. Additionally, the `sendMessage` endpoint lacked message length limits, posing a DoS risk.
**Learning:** Standardizing RBAC through tRPC middleware (like `adminProcedure`) reduces the risk of authorization bypass due to developer oversight. Implementing input length limits at the schema level (Zod) provides a simple and effective defense against resource exhaustion attacks.
**Prevention:** Always prefer standardized authorization procedures over manual inline checks. Apply strict Zod validation (e.g., `.int().positive()` for IDs and `.max()` for strings) to all public-facing inputs to ensure data integrity and prevent abuse.
