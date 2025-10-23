---
"@comet/admin-generator": patch
---

Restore persisted column state of generated DataGrid.

**What changed**

- Wrapped the DataGrid's column definitions in `useMemo` to ensure the `columns` prop keeps a stable reference between renders.

**Why**

- According to the MUI DataGrid documentation, the `columns` prop must keep the same reference across renders for persisted column state (width, order, visibility) to work correctly.
- Previously, column definitions were re-created on every render, which caused loss of the persisted state.

**Result**

- Column width and order are now properly restored across all admin-generated DataGrids.
