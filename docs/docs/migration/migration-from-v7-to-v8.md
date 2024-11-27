---
title: Migrating from v7 to v8
sidebar_position: 1
---

# Migrating from v7 to v8

First, execute `npx @comet/upgrade@latest v8` in the root of your project.
It automatically installs the new versions of all `@comet` libraries, runs an ESLint autofix and handles some of the necessary renames.

<details>

<summary>Changes handled by @comet/upgrade</summary>

-   Upgrade MUI packages to v6
-   Run MUI codemods
-   Upgrade MUI X packages to v6

</details>

## Admin

### Stay on same page after changing scope

The Admin now stays on the same page per default when changing scopes.
Perform the following changes:

1.  Remove the `path` prop from the `PagesPage` component

    ```diff title="admin/src/common/MasterMenu.tsx"
    <PagesPage
    -   path="/pages/pagetree/main-navigation"
        allCategories={pageTreeCategories}
        documentTypes={pageTreeDocumentTypes}
        category="MainNavigation"
        renderContentScopeIndicator={(scope) => <ContentScopeIndicator scope={scope} />}
    />
    ```

2.  Remove the `redirectPathAfterChange` prop from the `RedirectsPage` component

    ```diff title="admin/src/common/MasterMenu.tsx"
    {
        type: "route",
        primary: <FormattedMessage id="menu.redirects" defaultMessage="Redirects" />,
        route: {
            path: "/system/redirects",
    -       render: () => <RedirectsPage redirectPathAfterChange="/system/redirects" />,
    +       component: RedirectsPage
        },
        requiredPermission: "pageTree",
    },
    ```

3.  Optional: Remove unnecessary usages of the `useContentScopeConfig` hook

    ```diff
    export function ProductsPage() {
        const intl = useIntl();

    -   useContentScopeConfig({ redirectPathAfterChange: "/structured-content/products" });
    }
    ```

### Update MUI - X Packages

In `package.json` update the version of the MUI X packages to `^6.20.4`.

```diff
- "@mui/x-data-grid": "^5.x.x",
- "@mui/x-data-grid-pro": "^5.x.x",
- "@mui/x-data-grid-premium": "^5.x.x",

+ "@mui/x-data-grid": "^6.20.4",
+ "@mui/x-data-grid-pro": "^6.20.4",
+ "@mui/x-data-grid-premium": "^6.20.4",
```

:::note Codemod

```sh
npx @comet/upgrade v8/mui-x-upgrade.ts
```

:::

A lots of props have been renamed from MUI, for a detailed look, see the official [migration guide](https://mui.com/x/migration/migration-data-grid-v5). There is also a codemod from MUI which handles most of the changes:

```sh
npx @mui/x-codemod@latest v6.0.0/data-grid/preset-safe <path>
```

#### `useDataGridRemote` Hook - Return Value

The `useDataGridRemote` hook has been changed to match the updated DataGrid props:

```diff
- const { pageSize, page, onPageSizeChange } = useDataGridRemote();
+ const { paginationModel, onPaginationModelChange } = useDataGridRemote();
```

#### `muiGridSortToGql` Function

The `muiGridSortToGql` helper now expects the columns instead of the `apiRef`:

```diff
const columns : GridColDef[] = [/* column definitions*/];
const dataGridRemote = useDataGridRemote();
const persistentColumnState = usePersistentColumnState("persistent_column_state");

-  muiGridSortToGql(dataGridRemote.sortModel, persistentColumnState.apiRef);
+  muiGridSortToGql(dataGridRemote.sortModel, columns);
```

:::note Codemod

```sh
npx @comet/upgrade v8/mui-grid-sort-to-gql.ts
```

**Note:** Be aware, this will naively change the second argument of `muiGridSortToGql` function to columns variable, attempting that this variable is available in the current scope.

:::

#### MUI removed error prop on DataGrid

> The error and onError props were removed - the grid no longer catches errors during rendering. To catch errors that happen during rendering use the error boundary. The components.ErrorOverlay slot was also removed.
>
> – [MUI migration guide](https://mui.com/x/migration/migration-data-grid-v5/#removed-props)

:::note Codemod

```sh
npx @comet/upgrade v8/mui-data-grid-remove-error-prop.ts
```

**Note:** error handling must be implemented manually, the codemod simple removes all usages of the error prop on DataGrids and adds a TODO: comment.

:::

The recommended way to handle errors is to use the `ErrorBoundary` in the parent component and throw errors where the query error happens.

```diff
- const { loading, data, error } = useQuery(/* query parameters */)
- <DataGrid error={error} /* other props */ >

+ const { loading, data, error } = useQuery(/* query parameters */)
+ if (error) {
+     throw error
+ }
+ <DataGrid /* other props */ >
```
