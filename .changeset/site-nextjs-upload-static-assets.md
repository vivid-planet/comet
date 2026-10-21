---
"@dextinity/site-nextjs": minor
---

Add `uploadStaticAssets` to upload the static assets of a build to the static assets storage on startup

Call it in the site server before it starts listening, so that no page of the build is delivered before its `.next/static` files are in the storage.
Once an instance has uploaded the files of a build, later instances skip the upload.

```ts
const staticAssetsStorage = await createStaticAssetsStorage({ scheme: "s3", options: { bucket: process.env.STATIC_ASSETS_S3_BUCKET /* ... */ } });
await uploadStaticAssets({ storage: staticAssetsStorage, keyPrefix: "site" });

createServer(/* ... */).listen(port, host);
```
