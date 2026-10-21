---
"@dextinity/site-nextjs": minor
---

Add `serveStaticAsset` to serve static assets of other builds from a storage

During a rolling deployment, instances of the old and the new site build run side by side, so a request for a `/_next/static` file can reach an instance that doesn't have it.
`serveStaticAsset` serves such a file from a storage that holds the `.next/static` files of every deployed build, for instance uploaded with [rclone](https://rclone.org) after `next build`.
Requests for other paths, for files of the own build and for files missing in the storage are left to Next.js.

The storage is a [Flystorage](https://flystorage.dev) `FileStorage`, so any of its adapters can be used, e.g., `@flystorage/aws-s3` for AWS S3, DigitalOcean Spaces or other S3-compatible storages, or `@flystorage/azure-storage-blob` for Azure Blob Storage.
`@flystorage/file-storage` is an optional peer dependency.

**Example**

```ts
// In server.ts
import { S3Client } from "@aws-sdk/client-s3";
import { serveStaticAsset } from "@dextinity/site-nextjs/staticAssets";
import { AwsS3StorageAdapter } from "@flystorage/aws-s3";
import { FileStorage } from "@flystorage/file-storage";

const staticAssetsStorage = new FileStorage(
    new AwsS3StorageAdapter(new S3Client({ region: process.env.STATIC_ASSETS_S3_REGION /* ... */ }), {
        bucket: process.env.STATIC_ASSETS_S3_BUCKET,
        prefix: "site",
    }),
);

createServer(async (req, res) => {
    const parsedUrl = parse(req.url!, true);

    if (await serveStaticAsset({ pathname: parsedUrl.pathname, res, storage: staticAssetsStorage })) {
        return;
    }

    await handle(req, res, parsedUrl);
});
```
