---
"@comet/cms-api": major
---

Rename public uploads to file uploads

The name "public uploads" was not fitting since the uploads can also be used for "private" uploads in the Admin.
The feature was therefore renamed to "file uploads".

This requires the following changes:

-   Use `FileUploadsModule` instead of `PublicUploadModule`
-   Use `FileUpload` instead of `PublicUpload`
-   Use `FileUploadsService` instead of `PublicUploadsService`
-   Change the upload URL from `/public-upload/files/upload` to `/files-uploads/upload`
