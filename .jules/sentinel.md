## 2025-05-22 - [IP Spoofing and Server Hardening]
**Vulnerability:** The `ageVerification.verify` procedure accepted a client-provided `ipAddress`, which could be spoofed. Additionally, the Express server was missing standard security headers and exposed the `X-Powered-By` header.
**Learning:** Even when using tRPC, sensitive metadata like IP addresses should be resolved server-side from trusted sources (like `req.ip` with `trust proxy` enabled) rather than accepted as input. Relying on `x-forwarded-for` manually without `trust proxy` can also be risky or inconsistent.
**Prevention:** Always use server-side session/request properties for security-critical data. Harden Express servers by default with `app.disable("x-powered-by")` and essential security headers. Ensure tests mock the full context required by these security measures (e.g., adding `ip` to mock requests).

## 2026-04-12 - [Strict Input Validation and DoS Mitigation]
**Vulnerability:** Many API endpoints lacked length limits on string inputs and strict constraints on numeric IDs, potentially leading to Denial of Service (DoS) via large payloads or logic errors with negative IDs.
**Learning:** Generic Zod types like `z.string()` or `z.number()` are often insufficient. Without `.max()`, attackers can send massive strings to exhaust memory. Without `.int().positive()`, numeric inputs might bypass application logic expecting valid database primary keys.
**Prevention:** Always apply reasonable `.max()` limits to all string inputs and use `.int().positive()` for all database-backed numeric identifiers in TRPC schemas.
