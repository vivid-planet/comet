---
"@comet/cms-admin": minor
---

Add `dataGrid` option to `createTableBlock`

`@mui/x-data-grid-pro` runtime exports (`DataGridPro`, `GRID_REORDER_COL_DEF`, `useGridApiRef`, `useGridApiContext`) must now be passed via the `dataGrid` option, since the package is an optional peer dependency.

**Example**

```tsx
import { createTableBlock } from "@comet/cms-admin";
import { DataGridPro, GRID_REORDER_COL_DEF, useGridApiContext, useGridApiRef } from "@mui/x-data-grid-pro";

export const TableBlock = createTableBlock({
    richText: RichTextBlock,
    dataGrid: { DataGridPro, GRID_REORDER_COL_DEF, useGridApiRef, useGridApiContext },
});
```
