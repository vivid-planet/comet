---
"@comet/cms-api": minor
---

Support using `DamModule` for file upload and download without the full DAM

`DamModule` pulled in a lot of internal dependencies (`ImgproxyModule`, `UserPermissionsModule`, `DependenciesModule`), which made it hard to provide the plain DAM file upload/download endpoints in a standalone service (e.g. a separate public API microservice).

The heavy dependencies are now optional:

- **`fileOnly` mode:** Set `fileOnly: true` to register only the file/folder upload/download HTTP endpoints and their services. The GraphQL resolvers, blocks, image serving and dependents resolver — and their dependencies on `ImgproxyModule`, `UserPermissionsModule` and `DependenciesModule` — are skipped.
- **Imgproxy is optional:** When no `ImgproxyModule` is registered, the dominant-color calculation is skipped.
- **Access control is optional:** When an access control service is available (as in a full Comet app), the scope-based checks are applied as before. When it is not available, the endpoints fail closed and respond with `403 Forbidden`. To run the endpoints without an access control service — for example in a standalone service that protects them with its own authentication guard — set `disableScopeAccessControl: true`.

Existing usage of `DamModule` is unchanged.

**Example**

```ts
BlobStorageModule.register({
    backend: config.blob.storage,
    cacheDirectory: `${config.blob.storageDirectoryPrefix}-cache`,
}),
DamModule.register({
    damConfig: {
        secret: config.dam.secret,
        filesDirectory: `${config.blob.storageDirectoryPrefix}-files`,
        maxFileSize: config.dam.uploadsMaxFileSize,
        maxSrcResolution: config.dam.maxSrcResolution,
        allowedImageSizes: config.dam.allowedImageSizes,
        allowedAspectRatios: config.dam.allowedImageAspectRatios,
    },
    Scope: DamScope,
    File: DamFile,
    Folder: DamFolder,
    fileOnly: true,
    disableScopeAccessControl: true,
}),
```
