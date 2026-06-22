## 2025-05-22 - [IP Spoofing and Server Hardening]
**Vulnerability:** The `ageVerification.verify` procedure accepted a client-provided `ipAddress`, which could be spoofed. Additionally, the Express server was missing standard security headers and exposed the `X-Powered-By` header.
**Learning:** Even when using tRPC, sensitive metadata like IP addresses should be resolved server-side from trusted sources (like `req.ip` with `trust proxy` enabled) rather than accepted as input. Relying on `x-forwarded-for` manually without `trust proxy` can also be risky or inconsistent.
**Prevention:** Always use server-side session/request properties for security-critical data. Harden Express servers by default with `app.disable("x-powered-by")` and essential security headers. Ensure tests mock the full context required by these security measures (e.g., adding `ip` to mock requests).

## 2025-05-23 - [Centralized RBAC Enforcement]
**Vulnerability:** Manual role checks (e.g., `ctx.user.role !== "admin"`) were scattered across the `chatRouter`, increasing the risk of inconsistent authorization and accidental exposure of administrative endpoints.
**Learning:** Even when authorization logic is simple, manual checks in resolvers are prone to omission during refactoring or when adding new endpoints. Centralizing these checks into tRPC middlewares like `adminProcedure` makes security policy declarative and easier to audit.
**Prevention:** Always prioritize centralized middleware/procedures (`adminProcedure`) over manual role checks within individual route handlers. Use Zod schemas to enforce strict input validation (length limits, numeric constraints) as a first line of defense against DoS and injection.
