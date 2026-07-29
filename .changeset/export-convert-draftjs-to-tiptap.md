---
"@comet/cms-api": minor
---

Export `convertDraftJsToTipTap`

The function converting DraftJS content to a TipTap document is now part of the public API, so it can be used in custom migrations instead of only through `buildDraftJsToTipTapMigration`.

**Example**

```ts
import { convertDraftJsToTipTap } from "@comet/cms-api";

const tipTapContent = convertDraftJsToTipTap(draftContent, { supports: ["bold", "italic"] });
```
