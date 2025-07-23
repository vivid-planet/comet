---
"@comet/cms-api": major
---

Separate `FileUploadsModule` completely from `DamModule`

Multiple changes were necessary to achieve this:

- `ScaledImagesCacheService` was moved to `BlobStorageModule`
- You must now pass the `cacheDirectory` config option to `BlobStorageModule` (instead of `DamModule`)
- `ImgproxyService` was moved to its own `ImgproxyModule`
- You must add the `ImgproxyModule` to your `AppModule`
- In the `DamModule` config, the `maxSrcResolution` option was moved from the `imgproxyConfig` to the `damConfig`
