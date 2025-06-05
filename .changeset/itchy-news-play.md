---
"@comet/cms-api": minor
---

Add new methods `getFileContent` to the `FileUploadsService`

These methods allow you to retrieve a file's content as Buffer.
This is needed for cases like embedding images in a PDF or attaching files to emails.
