---
"@dextinity/cms-admin": minor
---

Add `createDamVideoBlock` factory

The factory allows restricting what the editor can set on a video, for sites that don't use all of it.
Pass what the site supports via `supports` — anything left out isn't shown in the block's admin component anymore.
Values that are already stored stay untouched, the editor just can't change them anymore.
The preview image remains part of the block's data in any case, leaving it out only hides it from the editor.

`DamVideoBlock` is now created with the factory and is still exported, so nothing needs to be changed in existing applications.

**Example**

A site that can't autoplay videos:

```tsx
import { createDamVideoBlock } from "@dextinity/cms-admin";

export const DamVideoBlock = createDamVideoBlock({ supports: ["loop", "showControls", "previewImage"] });
```

A site that only reads the video file's URL, so the editor is left with just the file to choose:

```tsx
export const DamVideoBlock = createDamVideoBlock({ supports: [] });
```
