---
"@comet/admin": minor
---

Add `useDataGridExcelExport` hook for exporting data as excel from DataGrid and `DataGridExcelExportButton` component

`useDataGridExcelExport` provides the function `exportGrid` to generate and export the excel file. Additionally a `loading` and `error` state is available.
`DataGridExcelExportButton` takes `exportApi` as parameter and handles export. Use `DataGridExcelExportButton` in the `DataGrid Toolbar`
