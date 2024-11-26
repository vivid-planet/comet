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
-   Upgrade MUI-X packages to v6

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

- "@mui/x-data-grid": "^6.20.4",
- "@mui/x-data-grid-pro": "^6.20.4",
- "@mui/x-data-grid-premium": "^6.20.4",
```

> **_Codemod available:_**
>
> ```
> npx @comet/upgrade v8/mui-x-upgrade.ts
> ```

A lots of props have been renamed from Mui, for detail look, see [Mui - Migration from v5 to v6](https://mui.com/x/migration/migration-data-grid-v5). There is also a codmod from mui which handles most of the changes.

> **_Mui v5 to v6 Codemod:_**
>
> ```
> npx @mui/x-codemod@latest v6.0.0/data-grid/preset-safe <path>
> ```

#### `useDataGridRemote` Hook - Return Value

Due to `useDataGridRemote` is intended to return Mui DataGrid compatible props, the return value has been updated to match the new MUI-X DataGrid API.

```typescript
- const { pageSize, page, onPageSizeChange } = useDataGridRemote();
+ const { paginationModel, onPaginationModelChange } = useDataGridRemote(); // paginationModel is an object with pageSize, page and onPageSizeChange
```

#### `muiGridSortToGql` Function

```diff

    const columns : GridColDef[] = [/* column definitions*/];
    const dataGridRemote = useDataGridRemote();
    const persistentColumnState = usePersistentColumnState("persistent_column_state");

-  muiGridSortToGql(dataGridRemote.sortModel, persistentColumnState.apiRef);
+  muiGridSortToGql(dataGridRemote.sortModel, columns);
```

> **_Codemod available:_** work in progress - TODO: ADD COMMAND

#### MUI removed error prop on DataGrid

> The error and onError props were removed - the grid no longer catches errors during rendering. To catch errors that happen during rendering use the error boundary. The components.ErrorOverlay slot was also removed.
> [Mui - Migration Guide v5 to v6 - removed props](https://mui.com/x/migration/migration-data-grid-v5/#removed-props)

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
