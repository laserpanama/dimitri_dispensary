## 2025-05-22 - [IP Spoofing and Server Hardening]
**Vulnerability:** The `ageVerification.verify` procedure accepted a client-provided `ipAddress`, which could be spoofed. Additionally, the Express server was missing standard security headers and exposed the `X-Powered-By` header.
**Learning:** Even when using tRPC, sensitive metadata like IP addresses should be resolved server-side from trusted sources (like `req.ip` with `trust proxy` enabled) rather than accepted as input. Relying on `x-forwarded-for` manually without `trust proxy` can also be risky or inconsistent.
**Prevention:** Always use server-side session/request properties for security-critical data. Harden Express servers by default with `app.disable("x-powered-by")` and essential security headers. Ensure tests mock the full context required by these security measures (e.g., adding `ip` to mock requests).

## 2025-05-24 - [Missing Input Validation Limits]
**Vulnerability:** Several tRPC endpoints (chat, orders, products, appointments, system) lacked maximum length constraints on string inputs and maximum item counts on array inputs, creating a risk for Resource Exhaustion and Denial of Service (DoS) attacks.
**Learning:** Even if application logic handles data safely, the overhead of parsing and storing oversized payloads can degrade server performance or cause crashes. Zod schemas provide a first line of defense that should be strictly defined.
**Prevention:** Always define `.max()` constraints for strings and arrays in Zod schemas for all API endpoints. Complement this with automated security tests that verify these limits are enforced.
