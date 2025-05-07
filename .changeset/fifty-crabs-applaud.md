---
"@comet/cms-api": patch
---

AccessLog: Remove some DAM URLs from log

Hashed URLs and preview URLs are not useful in the logs, so we remove them.
