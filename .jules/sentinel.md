## 2025-05-22 - [IP Spoofing and Server Hardening]
**Vulnerability:** The `ageVerification.verify` procedure accepted a client-provided `ipAddress`, which could be spoofed. Additionally, the Express server was missing standard security headers and exposed the `X-Powered-By` header.
**Learning:** Even when using tRPC, sensitive metadata like IP addresses should be resolved server-side from trusted sources (like `req.ip` with `trust proxy` enabled) rather than accepted as input. Relying on `x-forwarded-for` manually without `trust proxy` can also be risky or inconsistent.
**Prevention:** Always use server-side session/request properties for security-critical data. Harden Express servers by default with `app.disable("x-powered-by")` and essential security headers. Ensure tests mock the full context required by these security measures (e.g., adding `ip` to mock requests).

## 2025-05-23 - [Unbounded Input and DoS Prevention]
**Vulnerability:** Several tRPC procedures (chat messages, order items, system notifications) accepted unbounded strings and arrays, creating a risk for Denial of Service (DoS) via memory exhaustion or database performance degradation.
**Learning:** Even with structured APIs like tRPC, defense-in-depth requires explicit constraints on all user-provided data. Zod's `.max()` and `.min()` are essential for enforcing payload limits before they reach business logic or the database.
**Prevention:** Always apply `.max()` constraints to strings and arrays in Zod schemas for all public and protected procedures. Establish sensible defaults (e.g., 255 for titles, 5000 for long text, 20-50 for bulk operations) and verify them with dedicated input validation tests.
