---
"@comet/cms-admin": patch
---

Don't move files to a folder called "." when uploading them to the DAM

This bug only occurred in projects with a `react-dropzone` version >= 14.3.2.
