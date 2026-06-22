## 2025-05-22 - [IP Spoofing and Server Hardening]
**Vulnerability:** The `ageVerification.verify` procedure accepted a client-provided `ipAddress`, which could be spoofed. Additionally, the Express server was missing standard security headers and exposed the `X-Powered-By` header.
**Learning:** Even when using tRPC, sensitive metadata like IP addresses should be resolved server-side from trusted sources (like `req.ip` with `trust proxy` enabled) rather than accepted as input. Relying on `x-forwarded-for` manually without `trust proxy` can also be risky or inconsistent.
**Prevention:** Always use server-side session/request properties for security-critical data. Harden Express servers by default with `app.disable("x-powered-by")` and essential security headers. Ensure tests mock the full context required by these security measures (e.g., adding `ip` to mock requests).

## 2025-05-23 - [Brittle Database Success Checks]
**Vulnerability:** Relying on `affectedRows` for database update success can cause false negatives for idempotent operations (like `markMessagesAsRead`) if the target state is already reached. It also introduces driver-specific brittle logic (e.g., `(result as any).affectedRows` vs `(result as any)[0]?.affectedRows`).
**Learning:** Security state updates should verify that the change *occurred* or that the *end state is correct*, but idempotent UI operations should not fail with an error if no rows were changed because the operation was already performed.
**Prevention:** Distinguish between critical state transitions (which should check `affectedRows`) and idempotent operations. Use more robust success detection if the driver or database dialect might change.
