---
"@comet/cms-api": patch
---

Prevent socket exhaustion when streaming files and prevent the API from crashing due to stream errors in the `FileUploadsDownloadController`

We already added this fix to the DAM in the past.
