## 2025-05-22 - [IP Spoofing and Server Hardening]
**Vulnerability:** The `ageVerification.verify` procedure accepted a client-provided `ipAddress`, which could be spoofed. Additionally, the Express server was missing standard security headers and exposed the `X-Powered-By` header.
**Learning:** Even when using tRPC, sensitive metadata like IP addresses should be resolved server-side from trusted sources (like `req.ip` with `trust proxy` enabled) rather than accepted as input. Relying on `x-forwarded-for` manually without `trust proxy` can also be risky or inconsistent.
**Prevention:** Always use server-side session/request properties for security-critical data. Harden Express servers by default with `app.disable("x-powered-by")` and essential security headers. Ensure tests mock the full context required by these security measures (e.g., adding `ip` to mock requests).

## 2025-05-23 - [Input Length Limits and RBAC Enforcement]
**Vulnerability:** The chat system lacked input length limits on subjects and messages, posing a Denial of Service (DoS) risk. Additionally, administrative procedures relied on manual role checks rather than centralized middleware.
**Learning:** Centralizing RBAC using tRPC middlewares (like `adminProcedure`) reduces the risk of authorization bypass compared to manual checks within procedure bodies. Explicit Zod constraints on string lengths and numeric types provide a first line of defense against resource exhaustion and malformed data.
**Prevention:** Use `adminProcedure` for all admin-only endpoints. Always apply `.max()` constraints to user-provided strings and `.int().positive()` to database identifiers in Zod schemas.
