---
"@comet/cms-admin": patch
---

Don't read files into memory before uploading them to the DAM

Previously, every file was fully loaded into the browser's memory before the upload started, which could cause high memory usage and a delay before the upload progress was shown for large files.
