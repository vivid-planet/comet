---
"@comet/cms-api": minor
---

Split `DamModule` into composable sub-modules

`DamModule` is now a facade composing four sub-modules: `DamFilesModule` (file and folder storage, upload and serving), `DamImagesModule` (image scaling via imgproxy, dominant color), `DamBlocksModule` (block transformers) and `DamDependentsModule` (the `dependents` field on `DamFile`). `DamModule.register()` keeps its signature and still composes all four.

`DamModule` and its sub-modules now throw when they are registered more than once in the same process. A second registration would mount the DAM routes twice and add the `dependents` field to the file type again, so it never worked as intended.

Projects that only need DAM file upload and storage can register `DamFilesModule` on its own, without `ImgproxyModule` and without `DependenciesModule`:

```ts
DamFilesModule.register({ damConfig, Scope: DamScope, File: DamFile, Folder: DamFolder });
```

In that setup, `FilesService` receives no dominant color calculator, so uploads skip the color and `FilesService.calculateDominantColor` returns `undefined`.
