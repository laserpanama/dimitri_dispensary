## 2025-05-22 - Server Hardening and Body Limit Constraints
**Vulnerability:** Missing security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`) and exposed `X-Powered-By` header.
**Learning:** While reducing body limits is a standard DoS mitigation, in this codebase, the 50MB limit was explicitly set for functional requirements (likely large JSON-based uploads or legacy configurations). Drastically lowering it (e.g., to 1MB) without thorough verification of all upload paths can lead to functional regressions.
**Prevention:** Always check for comments explaining "large" configurations and search for potential high-payload paths before hardening resource limits. Focus on security headers as a non-breaking defense-in-depth measure.
