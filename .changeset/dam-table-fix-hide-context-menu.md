---
"@comet/cms-admin": patch
---

Fix `hideContextMenu` not hiding the context menu column in the DAM `DataGrid`

The visibility flag was applied to a no-longer-existing `contextMenu` column id; the column had been renamed to `actions`. The flag now targets the correct column.
