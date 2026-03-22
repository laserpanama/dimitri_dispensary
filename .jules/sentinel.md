## 2025-05-22 - [IP Spoofing and Server Hardening]
**Vulnerability:** The `ageVerification.verify` procedure accepted a client-provided `ipAddress`, which could be spoofed. Additionally, the Express server was missing standard security headers and exposed the `X-Powered-By` header.
**Learning:** Even when using tRPC, sensitive metadata like IP addresses should be resolved server-side from trusted sources (like `req.ip` with `trust proxy` enabled) rather than accepted as input. Relying on `x-forwarded-for` manually without `trust proxy` can also be risky or inconsistent.
**Prevention:** Always use server-side session/request properties for security-critical data. Harden Express servers by default with `app.disable("x-powered-by")` and essential security headers. Ensure tests mock the full context required by these security measures (e.g., adding `ip` to mock requests).

## 2025-05-23 - [DoS Mitigation and CSRF Hardening]
**Vulnerability:** Lack of input length limits in tRPC procedures and excessively large body parser limits (50mb) created a high risk for DoS attacks. Additionally, the session cookie was using `sameSite: "none"`, which is less secure than `lax` for CSRF protection.
**Learning:** Default configurations for body parsers often prioritize convenience over security; explicitly setting strict limits (e.g., 1mb) and adding Zod constraints to all user-provided strings is essential for defense-in-depth.
**Prevention:** Always implement `max()` constraints on Zod schemas for user input and configure restrictive global body limits. Prefer `sameSite: "lax"` for session cookies unless cross-site usage is explicitly required.
