---
"@comet/cms-api": minor
---

Split the DAM module into composable sub-modules

`DamModule` is now a thin facade composing three sub-modules: `DamFilesModule` (file/folder storage, upload and serving), `DamImagesModule` (image scaling via imgproxy, dominant color) and `DamBlocksModule` (block transformers). `DamModule.register()` is unchanged and keeps composing all three, so existing setups behave identically.

Projects that only need DAM file upload/storage can now register `DamFilesModule` on its own, without initializing `ImgproxyModule`:

```ts
DamFilesModule.register({ damConfig, Scope: DamScope, File: DamFile, Folder: DamFolder });
```

**Lighter services**

`FilesService` no longer depends on imgproxy. Its responsibilities were extracted into dedicated services and utilities:

- `DamDominantColorService` (imgproxy-backed dominant color computation)
- `DamFileCopyService` (`copyFilesToScope` / `createCopyOfFile`)
- `DamFolderZipService` (`createZipStreamFromFolder`)
- `dam-file-metadata.util` (content hashing and image metadata extraction)

The corresponding methods on `FilesService` and `FoldersService` remain available as deprecated delegators. `FilesService.calculateDominantColor` now returns `undefined` when `DamImagesModule` is not registered.
