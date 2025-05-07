---
"@comet/cms-api": patch
---

DAM: Set `cache-control: no-store` for folder download

Explicitly set `cache-control: no-store` for folder download to prevent caching of the response. Normally this should not be cached by any CDN, because the Request contains a cookie, but it is better to be explicit about it.
