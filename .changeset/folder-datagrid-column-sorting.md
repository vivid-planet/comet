---
"@comet/cms-admin": minor
---

Make DataGrid columns in DAM sortable

Make Name, Info, Creation, and Latest Change columns in the `FolderDataGrid` sortable via column header clicks, using the standard `muiGridSortToGql` pattern from generated grids. Remove the separate Sort dropdown from the toolbar. Sort state is now stored in URL params instead of localStorage.
