---
"@comet/cms-admin": minor
"@comet/cms-api": minor
---

Add support for temporary file uploads with configurable expiration times. The `expiredIn` duration can be set as a default value in the module configuration, and can be overridden by setting the value when using the `file-uploads.service.ts` or sending the request to the `file-uploads-upload.controller.ts`.

Files are automatically validated for expiration when accessed, and a new `delete-expired-file-uploads` command is provided for scheduled cleanup of expired files from storage.

The `FileUploadField` also supports overriding the `expiredIn` property.
