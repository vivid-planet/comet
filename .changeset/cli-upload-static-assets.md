---
"@dextinity/cli": minor
---

Add `upload-static-assets` command

During a rolling deployment, pods of the old and the new build run side by side. A request for a static asset of one build can reach a pod of the other build and fail with a `404`, e.g., a `ChunkLoadError` for `/_next/static` files in a Next.js site.
The command uploads a directory of static assets to a storage that keeps the files of all deployed builds, so that a pod can serve files it doesn't have itself from there.
Run it before the new pods start, e.g., as a Helm pre-upgrade hook.

The storage is configured via options or environment variables. Supported drivers are `s3`, `azure` and `file` (for local development).
The `s3` and `azure` drivers require `@aws-sdk/client-s3` or `@azure/storage-blob` to be installed in the project.

**Example**

```bash
STATIC_ASSETS_STORAGE_DRIVER=s3 \
STATIC_ASSETS_STORAGE_PREFIX=prod/_next/static \
STATIC_ASSETS_STORAGE_S3_BUCKET=my-site-static-assets \
STATIC_ASSETS_STORAGE_S3_REGION=eu-central-1 \
STATIC_ASSETS_STORAGE_S3_ACCESS_KEY_ID=... \
STATIC_ASSETS_STORAGE_S3_SECRET_ACCESS_KEY=... \
dextinity upload-static-assets --source-directory .next/static
```

Files of earlier uploads are kept. Remove old files with a lifecycle rule of the storage.
