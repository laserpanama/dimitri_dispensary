## 2025-05-15 - Secured Age Verification against IP Spoofing
**Vulnerability:** The `ageVerification.verify` endpoint allowed clients to provide an arbitrary `ipAddress` in the request body, which was then used for recording age verification events. This allowed for IP spoofing in logs.
**Learning:** Accepting security-sensitive data like IP addresses from the client-side input in tRPC procedures can lead to spoofing.
**Prevention:** Always derive the client's IP address from server-side sources like `ctx.req.headers["x-forwarded-for"]` or `ctx.req.socket.remoteAddress`.

## 2025-05-15 - Express Hardening with Security Headers
**Vulnerability:** The Express server was missing standard security headers, exposing the `X-Powered-By` header and lacking protection against MIME sniffing, clickjacking, and XSS.
**Learning:** Basic security headers are not enabled by default in Express 5 and should be manually configured or added via middleware like `helmet`.
**Prevention:** Explicitly disable `x-powered-by` and set `X-Content-Type-Options`, `X-Frame-Options`, and `X-XSS-Protection` in the main server setup.
