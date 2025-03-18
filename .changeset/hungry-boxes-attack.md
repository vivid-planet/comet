---
"@comet/cms-api": patch
---

DAM: Fix headers

While we fixed a few issues with cache control headers in https://github.com/vivid-planet/comet/pull/2653, there are still a few issues which need to be addressed. The following changes are part of a series of changes which will address the issues:

-   Only store the `content-type` header
-   Prevent imgproxy headers from being passed through to the client
-   Remove redundantly stored `content-type` for Azure storage accounts and S3 buckets
