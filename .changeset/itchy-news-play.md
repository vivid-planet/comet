---
"@comet/cms-api": minor
---

Add new methods `getFileContent` and `getFileAsBase64DataUri` to the `FileUploadsService`

These methods allow you to retrieve a file content.
This is needed for cases like embedding images in a PDF or attaching files to emails.
