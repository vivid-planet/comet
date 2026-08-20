---
"@dextinity/cms-admin": minor
---

Add `createDamVideoBlock` factory

The factory allows restricting the video options that are offered to the editor, for sites that can't support all of them.
Pass the supported options via `supports`, options that are left out aren't shown in the block's admin component anymore.
Values that are already stored stay untouched, the editor just can't change them anymore.

`DamVideoBlock` is now created with the factory and is still exported, so nothing needs to be changed in existing applications.

**Example**

A site that can't autoplay videos:

```tsx
import { createDamVideoBlock } from "@dextinity/cms-admin";

export const DamVideoBlock = createDamVideoBlock({ supports: ["loop", "showControls"] });
```
