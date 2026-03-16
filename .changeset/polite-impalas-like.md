---
"@comet/cms-admin": minor
"@comet/cms-api": minor
---

Add `TableBlock` using the `createTableBlock()` factory

The passed in `richText` block is used to edit the cell content.

**Admin:**

```ts
import { createTableBlock } from "@comet/cms-admin";
import { RichTextBlock } from "./RichTextBlock";

export const TableBlock = createTableBlock({ richText: RichTextBlock });
```

**API:**

```ts
import { createTableBlock } from "@comet/cms-api";
import { RichTextBlock } from "./rich-text.block";

export const TableBlock = createTableBlock({ richText: RichTextBlock });
```
