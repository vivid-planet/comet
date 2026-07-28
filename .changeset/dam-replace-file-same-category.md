---
"@comet/cms-api": minor
"@comet/cms-admin": minor
---

Allow replacing a DAM file with a file of the same category

Previously, a file could only be replaced by a new file with the exact same mimetype (e.g. `image/jpeg` could only be replaced by another `image/jpeg`). Replacing is now allowed for any file within the same category (SVG image, pixel image, audio, video, document), so for example a JPEG can be replaced by a WebP.

SVG images and pixel images remain distinct categories because they are handled differently internally (only pixel images carry image dimensions).
