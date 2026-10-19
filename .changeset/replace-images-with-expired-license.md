---
"@dextinity/cms-api": minor
---

Replace images with an expired license with a fallback image

When the license feature is enabled (`enableLicenseFeature`), `PixelImageBlock` renders a fallback image instead of an image whose license has expired.
The fallback image is set per DAM scope in the DAM settings.
It is delivered under its own URL and with its own crop area, the crop area set in the block is ignored.
If no fallback image is set, the block renders no image.
