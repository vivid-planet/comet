---
"@comet/cms-admin": patch
---

Stop importing `@mui/x-data-grid-pro` at runtime from the table block

The table block now uses `DataGrid` from `@mui/x-data-grid` instead of `DataGridPro` so that consumers don't have to install the Pro package, which is declared as an optional peer dependency. Pinned columns (drag handle on the left, row actions on the right) are now implemented via sticky positioning, and row reordering uses native HTML5 drag-and-drop. Type-only imports from `@mui/x-data-grid-pro` continue to be allowed.
