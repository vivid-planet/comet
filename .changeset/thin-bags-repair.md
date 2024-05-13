---
"@comet/admin": minor
---

Add the `useDataGridExcelExport` hook for exporting data from a `DataGrid` to an excel file 

The hook returns an `exportApi` encompassing: 

-   `exportGrid`: a function to generate and export the excel file
-   `loading`: a boolean indicating if the export is in progress
-   `error`: an error when the export has failed
