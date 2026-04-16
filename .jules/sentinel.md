## 2025-05-22 - [IP Spoofing and Server Hardening]
**Vulnerability:** The `ageVerification.verify` procedure accepted a client-provided `ipAddress`, which could be spoofed. Additionally, the Express server was missing standard security headers and exposed the `X-Powered-By` header.
**Learning:** Even when using tRPC, sensitive metadata like IP addresses should be resolved server-side from trusted sources (like `req.ip` with `trust proxy` enabled) rather than accepted as input. Relying on `x-forwarded-for` manually without `trust proxy` can also be risky or inconsistent.
**Prevention:** Always use server-side session/request properties for security-critical data. Harden Express servers by default with `app.disable("x-powered-by")` and essential security headers. Ensure tests mock the full context required by these security measures (e.g., adding `ip` to mock requests).

## 2026-04-16 - [Centralized Authorization and Input Hardening]
**Vulnerability:** Manual role checks were scattered across routers, and numeric IDs lacked integer/positive validation, while strings lacked length limits (DoS risk).
**Learning:** Manual role checks (e.g., `ctx.user.role === 'admin'`) are error-prone and harder to audit than centralized middleware. Missing input constraints can lead to unexpected database states or resource exhaustion.
**Prevention:** Use `adminProcedure` for all administrative endpoints to ensure consistent RBAC. Always apply `.int().positive()` to database IDs and `.max()` length limits to all user-provided strings in Zod schemas.
