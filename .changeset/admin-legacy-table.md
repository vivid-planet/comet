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

`FinalForm` and `DeleteMutation` no longer automatically refetch the surrounding legacy `TableQuery` via `TableQueryContext`. Previously, `FinalForm` (in `add` mode) and `DeleteMutation` implicitly refetched the table after a successful submit or delete. Since the table components have moved to `@comet/admin-legacy`, this implicit coupling has been removed.

To keep the data up to date, refetch the query explicitly:

- **`DeleteMutation`**: pass the queries to refetch via the existing `refetchQueries` prop.

    ```diff
    - <DeleteMutation mutation={deleteMutation}>
    + <DeleteMutation mutation={deleteMutation} refetchQueries={["ItemsList"]}>
    ```

- **`FinalForm`**: add `refetchQueries` to the mutation in your `onSubmit` handler.

    ```diff
      client.mutate({
          mutation: createMutation,
          variables,
    +     refetchQueries: ["ItemsList"],
      });
    ```

We recommend migrating away from the legacy table components to MUI X Data Grid in combination with `useDataGridRemote`, which handles refetching for you.
