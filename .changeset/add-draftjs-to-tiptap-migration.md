---
"@comet/cms-api": minor
---

Add `createDraftJsToTipTapMigration` for migrating DraftJS `RichTextBlock` data to `TipTapRichTextBlock` format

The migration converts DraftJS block types, inline styles, entity ranges (links), and list grouping to the equivalent TipTap/ProseMirror structure. After conversion the migrated content is validated against the ProseMirror schema. If validation fails, a stripped-down fallback (plain text paragraphs) is used instead.

**Usage**

```ts
import { createDraftJsToTipTapMigration, createTipTapRichTextBlock } from "@comet/cms-api";

const DraftJsToTipTapMigration = createDraftJsToTipTapMigration({
    supports: ["bold", "italic", "heading"],
    link: LinkBlock,
});

const MyRichTextBlock = createTipTapRichTextBlock(
    { supports: ["bold", "italic", "heading"], link: LinkBlock },
    { name: "RichText", migrate: { migrations: [DraftJsToTipTapMigration], version: 1 } },
);
```
