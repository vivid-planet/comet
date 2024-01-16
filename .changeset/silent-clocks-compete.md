---
"@comet/cms-admin": patch
---

Clip crop values when cropping an image in the DAM or `PixelImageBlock`

Previously, negative values could occur, causing the image proxy to fail on delivery.
