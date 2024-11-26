---
"@comet/admin-theme": major
"@comet/cms-admin": major
"@comet/admin": major
---

Bump @mui/x-data-grid from v5 to v6, which has breaking changes in DataGrid. see [Mui - Migration from v5 to v6](https://mui.com/x/migration/migration-data-grid-v5).
Change public API of `useDataGridRemote` hook.

```diff
- const { pageSize, page, onPageSizeChange } = useDataGridRemote();
+ const { paginationModel, onPaginationModelChange } = useDataGridRemote(); // paginationModel is an object with pageSize, page and onPageSizeChange
```

Change public API from `muiGridSortToGql` function.

```diff

    const columns : GridColDef[] = [/* column definitions*/];
    const dataGridRemote = useDataGridRemote();
    const persistentColumnState = usePersistentColumnState("persistent_column_state");

-  muiGridSortToGql(dataGridRemote.sortModel, persistentColumnState.apiRef);
+  muiGridSortToGql(dataGridRemote.sortModel, columns);
```
