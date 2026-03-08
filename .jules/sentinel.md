## 2025-05-22 - [IP Spoofing and Server Hardening]
**Vulnerability:** The `ageVerification.verify` procedure accepted a client-provided `ipAddress`, which could be spoofed. Additionally, the Express server was missing standard security headers and exposed the `X-Powered-By` header.
**Learning:** Even when using tRPC, sensitive metadata like IP addresses should be resolved server-side from trusted sources (like `req.ip` with `trust proxy` enabled) rather than accepted as input. Relying on `x-forwarded-for` manually without `trust proxy` can also be risky or inconsistent.
**Prevention:** Always use server-side session/request properties for security-critical data. Harden Express servers by default with `app.disable("x-powered-by")` and essential security headers. Ensure tests mock the full context required by these security measures (e.g., adding `ip` to mock requests).

## 2026-03-08 - [Input Length Validation and tRPC Type Safety]
**Vulnerability:** Several tRPC endpoints lacked string length limits, posing a risk of Resource Exhaustion (DoS). Additionally, a mismatch between tRPC procedure definitions (no input) and client calls (passing `{}`) caused TypeScript errors.
**Learning:** Always enforce `.max()` constraints on string inputs in Zod schemas to prevent malicious oversized payloads. When a tRPC procedure has no input, the client must use `undefined` rather than `{}` to satisfy strict TypeScript types.
**Prevention:** Include length limits in all Zod string schemas by default. Use `server/input-validation.test.ts` as a template for verifying these constraints.
