---
"@comet/cms-admin": patch
"@comet/cms-api": patch
---

Add `image/x-icon` to default accepted mimetypes

Previously, only `image/vnd.microsoft.icon` was supported. That could lead to problems uploading .ico files, since
`image/vnd.microsoft.icon` and `image/x-icon` are valid mimetypes for this format.
