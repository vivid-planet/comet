---
"@comet/admin": major
"@comet/admin-legacy": minor
---

Move the legacy table components to the new `@comet/admin-legacy` package

The deprecated Comet table components have been moved out of `@comet/admin` into a new `@comet/admin-legacy` package. This includes `Table`, `TableQuery`, `TableQueryContext`, `useTableQuery`, `useTableQuerySort`, `useTableQueryFilter`, `useTableQueryPaging`, the `FilterBar` components, the Excel export helpers (`ExcelExportButton`, `createExcelExportDownload`, `useExport*`), the paging action creators (`create*PagingActions`), `TableAddButton`, `TableDeleteButton`, `TableBodyRow`, `TableDndOrder`, `TableFilterFinalForm`, `TableLocalChanges`, `TablePagination`, `usePersistedState`, `usePersistedStateId`, `withTableQueryContext` and their related types.

Import these components from `@comet/admin-legacy` instead of `@comet/admin`:

```diff
- import { Table, TableQuery, useTableQuery } from "@comet/admin";
+ import { Table, TableQuery, useTableQuery } from "@comet/admin-legacy";
```

The automatic refetch of a legacy `TableQuery` after creating an item via `FinalForm` or deleting an item via `DeleteMutation` has been removed. Use MUI X Data Grid in combination with `useDataGridRemote` instead.
