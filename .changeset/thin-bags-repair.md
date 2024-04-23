---
"@comet/admin": minor
---

Add `useDataGridExcelExport` hook and `DataGridExcelExportButton` for exporting data from a `DataGrid` in an excel file

`useDataGridExcelExport` returns an `exportApi` encompassing 
- `exportGrid()` to generate and export the excel file
- `loading` 
- `error`

`DataGridExcelExportButton` is meant to be used in the `Toolbar`. It takes the `exportApi` and handles the export.
