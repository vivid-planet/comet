---
"@comet/cms-api": minor
---

Deprecate `FilesService.calculateDominantColor`

Computing the dominant color of an image was the only part of `FilesService` that used imgproxy. It moved to an internal service that `DamImagesModule` provides, so file handling no longer depends on imgproxy.

`FilesService.calculateDominantColor` returns the color when `DamImagesModule` is registered, and `undefined` when it is not.
