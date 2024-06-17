---
"@comet/cms-api": major
---

`FilesService#createFileDownloadUrl` now expects an options object as second parameter

```diff
- this.filesService.createFileDownloadUrl(file, previewDamUrls)
+ this.filesService.createFileDownloadUrl(file, { previewDamUrls, relativeDamUrls })
```
