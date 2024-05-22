---
"@comet/admin": minor
---

Add the ability to change by which fields a DataGrid column is sorted using `sortBy` in the column definition

This can be useful for custom columns that do not represent an actual field in the data, e.g., columns that render the data of multiple fields.

```tsx
const columns: GridColDef<GQLProductsListManualFragment>[] = [
    {
        field: "fullName",
        sortBy: ["firstName", "lastName"],
        renderCell: ({ row }) => `${row.firstName} ${row.lastName}`,
    },
];
```
