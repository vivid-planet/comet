---
"@comet/cms-api": minor
---

Add `DamDominantColorService`

Computing the dominant color of an image was the only part of `FilesService` that used imgproxy. It now lives in `DamDominantColorService`, which is the only DAM service that depends on `ImgproxyService`.

`FilesService.calculateDominantColor` remains available as a deprecated delegator.
