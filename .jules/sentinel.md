## 2025-05-22 - [IP Spoofing and Server Hardening]
**Vulnerability:** The `ageVerification.verify` procedure accepted a client-provided `ipAddress`, which could be spoofed. Additionally, the Express server was missing standard security headers and exposed the `X-Powered-By` header.
**Learning:** Even when using tRPC, sensitive metadata like IP addresses should be resolved server-side from trusted sources (like `req.ip` with `trust proxy` enabled) rather than accepted as input. Relying on `x-forwarded-for` manually without `trust proxy` can also be risky or inconsistent.
**Prevention:** Always use server-side session/request properties for security-critical data. Harden Express servers by default with `app.disable("x-powered-by")` and essential security headers. Ensure tests mock the full context required by these security measures (e.g., adding `ip` to mock requests).

## 2025-05-23 - [Inconsistent Authorization and Weak Input Validation]
**Vulnerability:** Administrative chat procedures (`getActiveConversations`, `assignToAgent`) used manual role checks instead of centralized middleware, and `updateAgentStatus` lacked authorization entirely. Additionally, `sendMessage` lacked input length limits and strict ID validation.
**Learning:** Manual authorization checks are error-prone and can lead to inconsistent security postures across similar endpoints. Lack of input validation (like length limits or ID range checks) can expose the system to DoS and malformed data issues.
**Prevention:** Use specialized tRPC procedures (like `adminProcedure`) to enforce RBAC consistently. Always validate input types, ranges, and lengths using Zod (e.g., `.int().positive()` for IDs and `.max()` for strings) to ensure defense-in-depth.
