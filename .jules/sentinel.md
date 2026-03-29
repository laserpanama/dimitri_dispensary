## 2025-05-22 - [IP Spoofing and Server Hardening]
**Vulnerability:** The `ageVerification.verify` procedure accepted a client-provided `ipAddress`, which could be spoofed. Additionally, the Express server was missing standard security headers and exposed the `X-Powered-By` header.
**Learning:** Even when using tRPC, sensitive metadata like IP addresses should be resolved server-side from trusted sources (like `req.ip` with `trust proxy` enabled) rather than accepted as input. Relying on `x-forwarded-for` manually without `trust proxy` can also be risky or inconsistent.
**Prevention:** Always use server-side session/request properties for security-critical data. Harden Express servers by default with `app.disable("x-powered-by")` and essential security headers. Ensure tests mock the full context required by these security measures (e.g., adding `ip` to mock requests).

## 2025-05-23 - [Insecure Defaults and Overly Permissive Limits]
**Vulnerability:** The application was using `sameSite: "none"` for session cookies, which is overly permissive and increases CSRF risk. Additionally, Express body parser limits were set to `50mb`, posing a resource exhaustion risk. Some admin procedures were missing centralized RBAC via `adminProcedure`.
**Learning:** Defaulting to secure configurations like `sameSite: "lax"` and restrictive payload limits is essential for defense in depth. Consistency in RBAC across all sensitive endpoints prevents accidental exposure.
**Prevention:** Audit session cookie and payload size configurations. Always use established middleware or procedures (like `adminProcedure`) for authorization rather than manual checks in route handlers.
