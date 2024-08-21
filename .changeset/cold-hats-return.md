---
"@comet/admin": minor
---

Allow pinning DataGrid columns using the column config when using `DataGridPro` or `DataGridPremium` with the `usePersistentColumnState` hook

```tsx
const columns: GridColDef[] = [
    {
        field: "title",
        pinned: "left",
    },
    // ... other columns
    {
        field: "actions",
        pinned: "right",
    },
];
```
