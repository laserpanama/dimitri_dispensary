## 2025-05-15 - [DoS via Large JSON Payload]
**Vulnerability:** Excessive body size limit (50MB) for `express.json()` and `express.urlencoded()` middlewares.
**Learning:** Initial boilerplate or templates often include overly permissive limits (e.g., for file uploads) that are not actually required by the application's endpoints. These large limits expose the server to memory exhaustion and CPU-intensive parsing of massive JSON payloads.
**Prevention:** Always set strict, sensible limits (e.g., 1MB or less) for JSON and URL-encoded parsers. Use specific middlewares like `multer` for legitimate file uploads.
