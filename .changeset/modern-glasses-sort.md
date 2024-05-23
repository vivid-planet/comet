---
"@comet/admin": minor
---

Add the `GridCellContent` component

Used to display primary and secondary texts and an icon in a `DataGrid` cell using the columns `renderCell` function.

```tsx
const columns: GridColDef[] = [
    {
        field: "title",
        renderCell: ({ row }) => <GridCellContent>{row.title}</GridCellContent>,
    },
    {
        field: "overview",
        renderCell: ({ row }) => <GridCellContent primaryText={row.title} secondaryText={row.description} icon={<Favorite />} />,
    },
];
```
