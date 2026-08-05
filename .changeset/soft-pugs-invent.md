---
"@comet/cms-admin": minor
"@comet/cms-api": minor
---

DAM: Allow replacing a file with a file of the same category instead of the same mimetype

Previously, "Replace File" only accepted a file with the exact same mimetype, so a JPEG couldn't be replaced by a WebP even though both are pixel images. Now a file can be replaced by any file of the same category:

| Category     | Examples             |
| ------------ | -------------------- |
| `pixelImage` | JPEG, PNG, WebP      |
| `svgImage`   | SVG                  |
| `audio`      | MP3, OGG, WAV        |
| `video`      | MP4, WebM, QuickTime |
| `other`      | PDF, DOCX, VTT, ZIP  |

SVG images and pixel images remain separate categories.

The file's URL and its usages stay unchanged. Only the extension of the file's name is adjusted to match the new file (for instance, `photo.jpg` becomes `photo.webp`). If a file with that name already exists in the same folder, the API rejects the replacement with a `CometFileNameAlreadyExistsException` and the Admin explains how to resolve the conflict.

The new `getDamFileCategory` helper is exported from both packages:

```ts
import { getDamFileCategory } from "@comet/cms-api"; // or "@comet/cms-admin"

getDamFileCategory("image/webp"); // "pixelImage"
getDamFileCategory("image/svg+xml"); // "svgImage"
```
