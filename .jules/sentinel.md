## 2025-05-22 - [IP Spoofing and Server Hardening]
**Vulnerability:** The `ageVerification.verify` procedure accepted a client-provided `ipAddress`, which could be spoofed. Additionally, the Express server was missing standard security headers and exposed the `X-Powered-By` header.
**Learning:** Even when using tRPC, sensitive metadata like IP addresses should be resolved server-side from trusted sources (like `req.ip` with `trust proxy` enabled) rather than accepted as input. Relying on `x-forwarded-for` manually without `trust proxy` can also be risky or inconsistent.
**Prevention:** Always use server-side session/request properties for security-critical data. Harden Express servers by default with `app.disable("x-powered-by")` and essential security headers. Ensure tests mock the full context required by these security measures (e.g., adding `ip` to mock requests).

## 2025-05-23 - [API Input Validation and DB Operation Verification]
**Vulnerability:** API endpoints lacked strict input validation (missing character limits for strings and positive/integer constraints for IDs). Database update functions in `server/chat-db.ts` returned `true` without verifying if any rows were actually modified.
**Learning:** Defense-in-depth requires validation at every layer. Schema-level constraints are not enough; API-level validation with Zod prevents DoS and data integrity issues. Verifying `affectedRows` for database updates is critical to prevent false-positive success responses to the frontend.
**Prevention:** Always use Zod to enforce strict types and length limits on all user-provided inputs. Capture and verify the result of database update operations using `affectedRows` to ensure data consistency.
