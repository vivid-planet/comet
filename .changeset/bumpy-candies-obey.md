---
"@comet/cms-api": patch
---

Fix `createFile` in `BlobStorageS3Storage`

Previously, uploading files to an S3 bucket caused this error:

> Are you using a Stream of unknown length as the Body of a PutObject request? Consider using Upload instead from @aws-sd k/lib-storage.
> An error was encountered in a non-retryable streaming request.
