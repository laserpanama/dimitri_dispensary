## 2025-05-22 - [IP Spoofing and Server Hardening]
**Vulnerability:** The `ageVerification.verify` procedure accepted a client-provided `ipAddress`, which could be spoofed. Additionally, the Express server was missing standard security headers and exposed the `X-Powered-By` header.
**Learning:** Even when using tRPC, sensitive metadata like IP addresses should be resolved server-side from trusted sources (like `req.ip` with `trust proxy` enabled) rather than accepted as input. Relying on `x-forwarded-for` manually without `trust proxy` can also be risky or inconsistent.
**Prevention:** Always use server-side session/request properties for security-critical data. Harden Express servers by default with `app.disable("x-powered-by")` and essential security headers. Ensure tests mock the full context required by these security measures (e.g., adding `ip` to mock requests).

## 2025-05-23 - [Input Validation and DoS Mitigation]
**Vulnerability:** tRPC procedures in `chat-router.ts` lacked length limits on string inputs and strict validation for database IDs, presenting a resource exhaustion (DoS) risk and potential for malformed data processing.
**Learning:** Hardening Zod schemas with `.int().positive()` for IDs and `.max()` for strings is a critical layer of defense-in-depth, even when application logic seems to handle common cases. It prevents excessive memory usage on the server and downstream LLM/database layers.
**Prevention:** Always apply strict validation to all external inputs. Use `.int().positive()` for database IDs and define reasonable `.max()` length constraints for all user-provided strings.
