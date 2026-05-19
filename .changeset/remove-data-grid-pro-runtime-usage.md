---
"@comet/cms-admin": patch
---

Remove `@mui/x-data-grid-pro` runtime usage from `TableBlock`

Replace `DataGridPro` with `DataGrid` from `@mui/x-data-grid` and remove Pro-only features (row reordering via drag-and-drop, column pinning) that required the Pro package at runtime. The `@mui/x-data-grid-pro` peer dependency remains optional and is no longer imported at runtime.
