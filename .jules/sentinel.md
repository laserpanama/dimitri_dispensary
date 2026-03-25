## 2025-05-22 - [IP Spoofing and Server Hardening]
**Vulnerability:** The `ageVerification.verify` procedure accepted a client-provided `ipAddress`, which could be spoofed. Additionally, the Express server was missing standard security headers and exposed the `X-Powered-By` header.
**Learning:** Even when using tRPC, sensitive metadata like IP addresses should be resolved server-side from trusted sources (like `req.ip` with `trust proxy` enabled) rather than accepted as input. Relying on `x-forwarded-for` manually without `trust proxy` can also be risky or inconsistent.
**Prevention:** Always use server-side session/request properties for security-critical data. Harden Express servers by default with `app.disable("x-powered-by")` and essential security headers. Ensure tests mock the full context required by these security measures (e.g., adding `ip` to mock requests).

## 2025-05-23 - [Consolidated Admin Authorization and Resource Limits]
**Vulnerability:** Chat agent endpoints (`getActiveConversations`, `assignToAgent`, `updateAgentStatus`) used manual role checks or generic `protectedProcedure`, creating risks of authorization bypass if checks were forgotten or misconfigured. Additionally, overly large body parser limits (50mb) increased DoS risks.
**Learning:** Prefer structured middleware like `adminProcedure` over manual `if (role !== "admin")` checks within procedure bodies to ensure consistent enforcement. Setting reasonable payload limits (e.g., 10mb) is a critical defense-in-depth measure against resource exhaustion.
**Prevention:** Centralize authorization logic using tRPC middleware. Audit server-wide configurations like body parser limits to ensure they align with the application's actual needs rather than defaulting to permissive values.
