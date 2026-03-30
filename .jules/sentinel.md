## 2025-05-22 - [IP Spoofing and Server Hardening]
**Vulnerability:** The `ageVerification.verify` procedure accepted a client-provided `ipAddress`, which could be spoofed. Additionally, the Express server was missing standard security headers and exposed the `X-Powered-By` header.
**Learning:** Even when using tRPC, sensitive metadata like IP addresses should be resolved server-side from trusted sources (like `req.ip` with `trust proxy` enabled) rather than accepted as input. Relying on `x-forwarded-for` manually without `trust proxy` can also be risky or inconsistent.
**Prevention:** Always use server-side session/request properties for security-critical data. Harden Express servers by default with `app.disable("x-powered-by")` and essential security headers. Ensure tests mock the full context required by these security measures (e.g., adding `ip` to mock requests).

## 2025-05-23 - [API Input Hardening and RBAC Standardization]
**Vulnerability:** API procedures accepted generic numeric IDs without verifying they were positive integers, and chat messages had no length limits, posing DoS risks. Administrative endpoints used manual role checks instead of centralized middleware.
**Learning:** tRPC procedures should leverage Zod's `.int().positive()` for all database IDs to prevent logic bypasses with negative or zero values. Centralizing authorization in `adminProcedure` ensures consistent security and easier auditing. Additionally, Drizzle update operations should verify `affectedRows` to ensure the logic was actually applied.
**Prevention:** Enforce strict input validation (type, format, and length) at the gateway layer. Prefer centralized authorization middleware over manual conditional checks within procedure handlers.
