---
"@dextinity/cli": minor
---

Add `upload-static-assets` command

The command uploads a directory of static assets to a storage under a key prefix.
Files that already exist in the storage are kept.

The storage is configured via options or environment variables. Supported drivers are `s3` (also for S3-compatible storages), `azure` and `file`.
The `s3` and `azure` drivers require `@aws-sdk/client-s3` or `@azure/storage-blob` to be installed in the project.

**Example**

```bash
STATIC_ASSETS_STORAGE_DRIVER=s3 \
STATIC_ASSETS_STORAGE_PREFIX=assets \
STATIC_ASSETS_STORAGE_S3_BUCKET=my-bucket \
STATIC_ASSETS_STORAGE_S3_REGION=eu-central-1 \
STATIC_ASSETS_STORAGE_S3_ACCESS_KEY_ID=... \
STATIC_ASSETS_STORAGE_S3_SECRET_ACCESS_KEY=... \
dextinity upload-static-assets --source-directory ./public/images
```
