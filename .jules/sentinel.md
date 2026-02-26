## 2025-05-15 - [Hardening Age Verification and Express Security]
**Vulnerability:** The age verification system accepted an `ipAddress` from the client input, allowing for easy IP spoofing. Additionally, the Express server lacked basic security headers and was configured without `trust proxy`, which could lead to incorrect IP resolution when behind a load balancer.
**Learning:** Client-provided metadata (like IP addresses) should never be trusted if they are used for compliance or security records. Server-side resolution is mandatory.
**Prevention:** Always resolve the client's IP address directly from the request object (`req.ip`) and ensure the server is correctly configured to trust upstream proxies when deployed in production environments.
