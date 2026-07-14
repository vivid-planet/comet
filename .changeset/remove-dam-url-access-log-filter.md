---
"@comet/cms-api": minor
---

Remove special handling that excluded DAM URLs from the access log

Previously, requests to DAM routes were excluded from the access log. They are now logged like any other HTTP request.
