---
"@comet/cms-api": minor
---

Remove special handling that excluded DAM URLs from the access log

Previously, requests to DAM routes (images, file preview, download, etc.) were automatically excluded from the access log. These requests are now logged like any other HTTP request.
