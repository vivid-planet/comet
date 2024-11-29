---
"@comet/admin-theme": major
"@comet/cms-admin": major
"@comet/admin": major
---

Bump @mui/x-data-grid peer dependency to v7

This has breaking changes in DataGrid.
Follow the official [migration guide](<(https://mui.com/x/migration/migration-data-grid-v6/)>) to upgrade.

As well, be aware if you have a date in the datagrid, you will need to add a `valueGetter`

before
```typescript
    <DataGrid
        //other props
        columns=[
        {
            field: "updatedAt",
            type: "dateTime",
        }] 
    />
```

after:
```typescript
    <DataGrid
        //other props
        columns=[
        {
            field: "updatedAt",
            type: "dateTime",
            valueGetter: (params, row) => row.updatedAt && new Date(row.updatedAt)
        }] 
    />
```