---
"@comet/cms-admin": major
"@comet/admin": major
---

Bump @mui/x-data-grid peer dependency to v7

This has breaking changes in DataGrid.
Follow the official [migration guide](<(https://mui.com/x/migration/migration-data-grid-v6/)>) to upgrade.

As well, be aware if you have a date in the data grid, you will need to add a `valueGetter`

```diff
    <DataGrid
        //other props
        columns=[
        {
            field: "updatedAt",
            type: "dateTime",
+            valueGetter: (params, row) => row.updatedAt && new Date(row.updatedAt)
        }]
    />
```

Also, be aware if you have a `valueGetter` or `valueFormatter` in the data grid, you will need to change the arguments passing to the functions. Previously, arguments were passed as an object. Now, they are passed directly as individual parameters

```diff
    <DataGrid
        //other props
        columns=[
        {
            field: "updatedAt",
            type: "dateTime",
-           valueGetter: ({params, row}) => row.updatedAt && new Date(row.updatedAt)
+           valueGetter: (params, row) => row.updatedAt && new Date(row.updatedAt)
-           valueFormatter: ({value}) => (value ? intl.formatDate(value, { dateStyle: "medium", timeStyle: "short" }) : ""),
+           valueFormatter: (value) => (value ? intl.formatDate(value, { dateStyle: "medium", timeStyle: "short" }) : ""),
        }]
    />
```
