## 2025-05-22 - [IP Spoofing and Server Hardening]
**Vulnerability:** The `ageVerification.verify` procedure accepted a client-provided `ipAddress`, which could be spoofed. Additionally, the Express server was missing standard security headers and exposed the `X-Powered-By` header.
**Learning:** Even when using tRPC, sensitive metadata like IP addresses should be resolved server-side from trusted sources (like `req.ip` with `trust proxy` enabled) rather than accepted as input. Relying on `x-forwarded-for` manually without `trust proxy` can also be risky or inconsistent.
**Prevention:** Always use server-side session/request properties for security-critical data. Harden Express servers by default with `app.disable("x-powered-by")` and essential security headers. Ensure tests mock the full context required by these security measures (e.g., adding `ip` to mock requests).

## 2025-05-23 - [Brittle Database Update Verification]
**Vulnerability:** Attempting to verify database updates by manually checking `result.affectedRows` using `(result as any)` is brittle and driver-dependent. In this project, MySQL2 returns `affectedRows`, but other drivers (SQLite, Postgres) use different property names.
**Learning:** Hard-coding driver-specific properties like `affectedRows` without abstraction or type safety can lead to silent failures where updates are reported as failed even when successful. Also, security changes must strictly adhere to line-count constraints to ensure they are easily reviewable and don't introduce regression.
**Prevention:** Avoid using `any` when checking database results. Use Drizzle's built-in success indicators or ensure the DB driver's return type is properly handled. Keep security patches focused and under the specified line limit.
