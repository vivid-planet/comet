---
"@dextinity/cms-admin": minor
"@dextinity/cms-api": minor
---

DAM: Allow replacing a file with a file of the same category instead of the same mimetype

Previously, "Replace File" only accepted a file with the exact same mimetype, so a JPEG couldn't be replaced by a WebP even though both are pixel images. Now a file can be replaced by any file of the same category:

| Category     | Examples             |
| ------------ | -------------------- |
| `pixelImage` | JPEG, PNG, WebP      |
| `svgImage`   | SVG                  |
| `audio`      | MP3, OGG, WAV        |
| `video`      | MP4, WebM, QuickTime |
| `document`   | PDF, DOCX, VTT, ZIP  |

SVG images and pixel images remain separate categories.

The file's usages stay unchanged. Only the extension of the file's name is adjusted to match the new file (for instance, `photo.jpg` becomes `photo.webp`). If a file with that name already exists in the same folder, a counter is appended to keep the name unique (for instance, `photo-2.webp`), and the Admin shows a snackbar informing about the new name.

The new `getDamFileCategory` helper is exported from both packages:

```ts
import { getDamFileCategory } from "@dextinity/cms-api"; // or "@dextinity/cms-admin"

getDamFileCategory("image/webp"); // "pixelImage"
getDamFileCategory("image/svg+xml"); // "svgImage"
```
