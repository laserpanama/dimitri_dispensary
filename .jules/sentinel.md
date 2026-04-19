## 2025-05-22 - [IP Spoofing and Server Hardening]
**Vulnerability:** The `ageVerification.verify` procedure accepted a client-provided `ipAddress`, which could be spoofed. Additionally, the Express server was missing standard security headers and exposed the `X-Powered-By` header.
**Learning:** Even when using tRPC, sensitive metadata like IP addresses should be resolved server-side from trusted sources (like `req.ip` with `trust proxy` enabled) rather than accepted as input. Relying on `x-forwarded-for` manually without `trust proxy` can also be risky or inconsistent.
**Prevention:** Always use server-side session/request properties for security-critical data. Harden Express servers by default with `app.disable("x-powered-by")` and essential security headers. Ensure tests mock the full context required by these security measures (e.g., adding `ip` to mock requests).

## 2025-05-23 - [Input Validation and Centralized Authorization]
**Vulnerability:** The `chatRouter` lacked string length limits on messages and subjects, creating a potential DoS vector. Administrative routes also relied on manual role checks rather than centralized middleware.
**Learning:** Authenticated routes are not inherently safe from malicious input; missing length limits can lead to resource exhaustion. Manual authorization checks are brittle and increase the risk of "forgotten check" vulnerabilities.
**Prevention:** Always define maximum lengths for string inputs in schemas. Use specialized tRPC procedures (like `adminProcedure`) to enforce role-based access control consistently across the router.
