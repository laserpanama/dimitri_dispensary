## 2025-05-22 - [IP Spoofing and Server Hardening]
**Vulnerability:** The `ageVerification.verify` procedure accepted a client-provided `ipAddress`, which could be spoofed. Additionally, the Express server was missing standard security headers and exposed the `X-Powered-By` header.
**Learning:** Even when using tRPC, sensitive metadata like IP addresses should be resolved server-side from trusted sources (like `req.ip` with `trust proxy` enabled) rather than accepted as input. Relying on `x-forwarded-for` manually without `trust proxy` can also be risky or inconsistent.
**Prevention:** Always use server-side session/request properties for security-critical data. Harden Express servers by default with `app.disable("x-powered-by")` and essential security headers. Ensure tests mock the full context required by these security measures (e.g., adding `ip` to mock requests).

## 2025-05-23 - [Input Validation and DoS Mitigation]
**Vulnerability:** tRPC procedures lacked input length and array size limits, and the Express server had overly permissive 50mb body limits, creating a resource exhaustion (DoS) risk.
**Learning:** Default Zod string and array types are unbounded. Without explicit `.max()` constraints, an attacker can send massive payloads that consume excessive memory during parsing or cause issues in the database.
**Prevention:** Always apply `.max()` limits to user-controlled strings and arrays in API schemas. Set conservative global body parser limits (e.g., 1mb) unless large uploads are explicitly required.
