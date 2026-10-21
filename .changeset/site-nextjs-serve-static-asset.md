---
"@dextinity/site-nextjs": minor
---

Add `serveStaticAsset` to serve static assets of other builds from a storage

During a rolling deployment, instances of the old and the new site build run side by side, so a request for a `/_next/static` file can reach an instance that doesn't have it.
`serveStaticAsset` serves such a file from a storage that holds the `.next/static` files of every deployed build, for instance uploaded with [rclone](https://rclone.org) after `next build`.
It passes on the content type and cache header stored with the file. Requests for other paths, for files of the own build and for files missing in the storage are left to Next.js.

`createStaticAssetsStorage` supports S3-compatible storages (`driver: "s3"`, e.g., AWS S3, DigitalOcean Spaces or IBM Cloud Object Storage) and Azure Blob Storage (`driver: "azure"`).
They require `@aws-sdk/client-s3` or `@azure/storage-blob`, which are loaded on the first request.

**Example**

```ts
// In server.ts
import { createStaticAssetsStorage, serveStaticAsset } from "@dextinity/site-nextjs/staticAssets";

const staticAssetsStorage = createStaticAssetsStorage({
    driver: "s3",
    s3: { bucket: process.env.STATIC_ASSETS_S3_BUCKET, region: process.env.STATIC_ASSETS_S3_REGION /* ... */ },
});

createServer(async (req, res) => {
    const parsedUrl = parse(req.url!, true);

    if (await serveStaticAsset({ pathname: parsedUrl.pathname, res, storage: staticAssetsStorage, keyPrefix: "site" })) {
        return;
    }

    await handle(req, res, parsedUrl);
});
```
