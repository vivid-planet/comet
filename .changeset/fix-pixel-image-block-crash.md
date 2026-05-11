---
"@comet/cms-admin": patch
---

Fix `PixelImageBlock.AdminComponent` crash when selecting a DAM file

`damFileFieldFragment` now includes `cropArea` so the Apollo cache has the required data when `PixelImageBlock` renders after a file is selected via `FileField`.
