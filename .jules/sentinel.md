## 2026-03-02 - IP Spoofing in Age Verification
**Vulnerability:** The age verification system accepted an `ipAddress` from the client-side input schema, allowing users to spoof their IP address.
**Learning:** Procedures requiring client identity or location (like compliance-related IP logging) must resolve this data server-side from the request context.
**Prevention:** Avoid including client-identifiable information in input schemas when that information is available in the request metadata (headers/socket). Ensure `trust proxy` is configured if the application is behind a reverse proxy.
