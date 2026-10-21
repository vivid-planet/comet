---
"@dextinity/site-nextjs": minor
---

Add `uploadStaticAssets` and `serveStaticAsset` to serve static assets of other builds during rolling deployments

During a rolling deployment, instances of the old and the new site build run side by side, so a request for a `/_next/static` file can reach an instance that doesn't have it.
`uploadStaticAssets` uploads the `.next/static` files of the build to a storage that holds the files of every deployed build, and `serveStaticAsset` serves a file that's missing in the own build from there.

Call `uploadStaticAssets` in the site server before it starts listening, so that no page of the build is delivered before its files are in the storage.
Once an instance has uploaded the files of a build, later instances skip the upload.

The storage is an [Apache OpenDAL](https://opendal.apache.org/docs/bindings/nodejs/) `Operator`, so all OpenDAL services are supported, e.g., S3-compatible storages (`"s3"`, like AWS S3, DigitalOcean Spaces or IBM Cloud Object Storage) and Azure Blob Storage (`"azblob"`).
This requires the `opendal` package.

**Example**

```ts
// In server.ts
import { serveStaticAsset, uploadStaticAssets } from "@dextinity/site-nextjs/staticAssets";
import { Operator } from "opendal";

const staticAssetsStorage = new Operator("s3", {
    bucket: process.env.STATIC_ASSETS_S3_BUCKET,
    region: process.env.STATIC_ASSETS_S3_REGION /* ... */,
});
await uploadStaticAssets({ storage: staticAssetsStorage, keyPrefix: "site" });

createServer(async (req, res) => {
    const parsedUrl = parse(req.url!, true);

    if (await serveStaticAsset({ pathname: parsedUrl.pathname, res, storage: staticAssetsStorage, keyPrefix: "site" })) {
        return;
    }

    await handle(req, res, parsedUrl);
}).listen(port, host);
```
