---
"@dextinity/site-nextjs": minor
---

Add `serveStaticAssetFromS3` to serve static assets of other builds from an S3 bucket

During a rolling deployment, instances of the old and the new site build run side by side, so a request for a `/_next/static` file can reach an instance that doesn't have it.
`serveStaticAssetFromS3` serves such a file from an S3 bucket that holds the `.next/static` files of every deployed build, for instance uploaded with [rclone](https://rclone.org) after `next build`.
It passes on the content type and cache header stored with the file. Requests for other paths, for files of the own build and for files missing in the bucket are left to Next.js.

It requires `@aws-sdk/client-s3`.

**Example**

```ts
// In server.ts
import { S3Client } from "@aws-sdk/client-s3";
import { serveStaticAssetFromS3 } from "@dextinity/site-nextjs/staticAssets";

const staticAssetsFromS3 = {
    s3Client: new S3Client({ region: process.env.STATIC_ASSETS_S3_REGION /* ... */ }),
    bucket: process.env.STATIC_ASSETS_S3_BUCKET,
    keyPrefix: "site",
};

createServer(async (req, res) => {
    const parsedUrl = parse(req.url!, true);

    if (await serveStaticAssetFromS3({ pathname: parsedUrl.pathname, res, ...staticAssetsFromS3 })) {
        return;
    }

    await handle(req, res, parsedUrl);
});
```
