---
"@comet/admin": minor
---

Add the ability to make `DataGrid` columns responsive by setting the `visible` property of the column definition to a media query

This can be used to hide certain columns on smaller screens and show a combined column instead.

This will only work when using `usePersistentColumnState` with `DataGridPro`/`DataGridPremium`.
When defining the columns, use the `GridColDef` type from `@comet/admin` instead of `@mui/x-data-grid`.

```ts
const columns: GridColDef[] = [
    {
        field: "fullName",
        visible: theme.breakpoints.down("md"),
    },
    {
        field: "firstName",
        visible: theme.breakpoints.up("md"),
    },
    {
        field: "lastName",
        visible: theme.breakpoints.up("md"),
    },
];
```
