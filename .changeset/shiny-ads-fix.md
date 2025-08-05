---
"@comet/cms-admin": major
"@comet/admin": major
---

Bump @mui/x-data-grid peer dependency to v6

This has breaking changes in DataGrid.
Follow the official [migration guide](<(https://mui.com/x/migration/migration-data-grid-v5)>) to upgrade.

The `useDataGridRemote` hook has been changed to match the updated DataGrid props:

```diff
- const { pageSize, page, onPageSizeChange } = useDataGridRemote();
+ const { paginationModel, onPaginationModelChange } = useDataGridRemote();
```

The `muiGridSortToGql` helper now expects the columns instead of the `apiRef`:

```diff
const columns : GridColDef[] = [/* column definitions */];
const dataGridRemote = useDataGridRemote();
const persistentColumnState = usePersistentColumnState("persistent_column_state");

-  muiGridSortToGql(dataGridRemote.sortModel, persistentColumnState.apiRef);
+  muiGridSortToGql(dataGridRemote.sortModel, columns);
```
