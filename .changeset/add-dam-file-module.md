---
"@comet/cms-api": minor
---

Add `DamFileModule` for using DAM file upload and download without the full DAM

`DamModule` pulled in a lot of internal dependencies (`ImgproxyModule`, `UserPermissionsModule`, `DependenciesModule`), which made it hard to provide the plain DAM file upload/download endpoints in a standalone service (e.g. a separate public API microservice).

The file upload/download stack has been extracted into a new lightweight `DamFileModule`. It provides the `FilesService`, `FoldersService` and the file/folder HTTP endpoints (upload, replace, stream, download, zip) and only requires `BlobStorageModule`:

- Imgproxy is now optional. When no `ImgproxyModule` is registered, the dominant-color calculation is skipped.
- Access control is now optional. When an `ACCESS_CONTROL_SERVICE` is available (as in a full Comet app using `DamModule`), the scope-based checks are applied as before. When it is not available, the endpoints fail closed and respond with `403 Forbidden`. To run the endpoints without an access control service — for example in a standalone service that protects them with its own authentication guard — set `disableScopeAccessControl: true`.

`DamModule` now builds on top of `DamFileModule` and adds the GraphQL resolvers, image serving, blocks and the user-permission based access control. Existing usage of `DamModule` is unchanged.

**Example**

```ts
BlobStorageModule.register({
    backend: config.blob.storage,
    cacheDirectory: `${config.blob.storageDirectoryPrefix}-cache`,
}),
DamFileModule.register({
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
}),
```
