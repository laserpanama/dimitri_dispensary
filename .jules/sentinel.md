## 2025-05-22 - [IP Spoofing and Server Hardening]
**Vulnerability:** The `ageVerification.verify` procedure accepted a client-provided `ipAddress`, which could be spoofed. Additionally, the Express server was missing standard security headers and exposed the `X-Powered-By` header.
**Learning:** Even when using tRPC, sensitive metadata like IP addresses should be resolved server-side from trusted sources (like `req.ip` with `trust proxy` enabled) rather than accepted as input. Relying on `x-forwarded-for` manually without `trust proxy` can also be risky or inconsistent.
**Prevention:** Always use server-side session/request properties for security-critical data. Harden Express servers by default with `app.disable("x-powered-by")` and essential security headers. Ensure tests mock the full context required by these security measures (e.g., adding `ip` to mock requests).

## 2026-03-16 - [Resource Exhaustion via Unbounded Inputs]
**Vulnerability:** Multiple tRPC procedures (chat, orders, appointments, system notifications) lacked input length and count limits. An attacker could send massive strings or arrays to exhaust server memory or degrade database performance (DoS).
**Learning:** tRPC procedures should always implement strict Zod validation with `.max()` constraints for all variable-length inputs (strings, arrays) to provide a defensive ceiling against resource exhaustion.
**Prevention:** Apply `.max()` to all string and array inputs in tRPC schemas. Create a dedicated security test suite to verify that these limits are enforced and that oversized inputs are rejected before reaching the business logic.
