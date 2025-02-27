---
"@comet/cms-api": patch
---

DAM: Fix headers

While we fixed a few issues with cache control headers in https://github.com/vivid-planet/comet/pull/2653, there are still a few issues with the way the headers were being handled:

-   All headers are stored while we only need the `content-type` header.
-   Imgproxy headers are passed through to the client.
-   `content-type` is stored redundantly for AzureStorageAccounts and S3 Buckets.
