---
"@comet/cms-api": minor
---

Add new `getFileContent` method to the `FileUploadsService`

This method allows you to retrieve a file's content as a Buffer.
This is needed for cases like embedding images in a PDF or attaching files to emails.
