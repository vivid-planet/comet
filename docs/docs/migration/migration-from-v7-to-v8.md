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
-   Upgrade NestJS packages to v10
-   Remove passport-dependencies (we don't use passport anymore)
-   Add @nestjs/jwt dependencies

</details>

## API

### Upgrade peer dependencies

#### NestJS

The NestJS peer dependency has been bumped to v10.

1.  Upgrade all your dependencies to support NestJS v10:

    ```diff title=api/package.json
    {
        "dependencies": {
    +       "@apollo/server": "^4.0.0",
    -       "@nestjs/apollo": "^10.0.0",
    -       "@nestjs/common": "^9.0.0",
    -       "@nestjs/config": "^2.0.0",
    -       "@nestjs/core": "^9.0.0",
    -       "@nestjs/graphql": "^10.0.0",
    -       "@nestjs/passport": "^9.0.0",
    -       "@nestjs/platform-express": "^9.0.0",
    +       "@nestjs/apollo": "^12.0.0",
    +       "@nestjs/common": "^10.0.0",
    +       "@nestjs/core": "^10.0.0",
    +       "@nestjs/graphql": "^12.0.0",
    +       "@nestjs/passport": "^10.0.0",
    +       "@nestjs/platform-express": "^10.0.0",
    -       "apollo-server-core": "^3.0.0",
    -       "apollo-server-express": "^3.0.0",
    -       "graphql": "^15.0.0",
    +       "graphql": "^16.6.0",
    -       "nestjs-console": "^8.0.0",
    +       "nestjs-console": "^9.0.0"
        },
        "devDependencies": {
    -       "@nestjs/cli": "^9.0.0",
    -       "@nestjs/schematics": "^9.0.0",
    -       "@nestjs/testing": "^9.0.0",
    +       "@nestjs/cli": "^10.0.0",
    +       "@nestjs/schematics": "^10.0.0",
    +       "@nestjs/testing": "^10.0.0"
        }
    }
    ```

    :::note Codemod available

    ```sh
    npx @comet/upgrade v8/update-nest-dependencies.ts
    ```

    :::

2.  Update the custom `formatError` function to hide GraphQL field suggestions:

    ```diff title=api/src/app.module.ts
    - import { ValidationError } from "apollo-server-express";
    + import { ValidationError } from "@nestjs/apollo";

    /* ... */

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
        /* ... */
        useFactory: (moduleRef: ModuleRef) => ({
            /* ... */,
            formatError: (error) => {
                // Disable GraphQL field suggestions in production
                if (process.env.NODE_ENV !== "development") {
    -               if (error instanceof ValidationError) {
    +               if (error.extensions?.code === "GRAPHQL_VALIDATION_FAILED") {
                        return new ValidationError("Invalid request.");
                    }
                }
                return error;
            },

        }),
    }),
    ```

    :::note Codemod available

    ```sh
    npx @comet/upgrade v8/update-graphql-format-error.ts
    ```

    :::

#### class-validator

The class-validator peer dependency has been bumped to v0.14.0:

```diff title=api/package.json
{
    "dependencies": {
-       "class-validator": "0.13.2",
+       "class-validator": "^0.14.0",
    }
}
```

:::note Codemod available

```sh
npx @comet/upgrade v8/update-class-validator.ts
```

:::

### Remove passport

Remove all passport-dependencies and add @nestjs/jwt

```diff title=api/package.json
{
    "dependencies": {
-       "@nestjs/passport": "^9.0.0",
-       ...other passport dependencies
+       "@nestjs/jwt": "^10.2.0",
    }
}
```

:::note Codemod available

```sh
npx @comet/upgrade v8/remove-passport.ts
```

:::

Rename the `strategy`-factories and wrap them in `...createAuthGuardProviders()`:

```diff title=api/src/auth/auth.module.ts
-   createStaticCredentialsBasicStrategy({ ... }),
-   createAuthProxyJwtStrategy({ ... }),
-   createStaticCredentialsBasicStrategy({ ... }),
+   ...createAuthGuardProviders(
+       createBasicAuthService({ ... }),
+       createJwtAuthService({ ... }),
+       createStaticUserAuthService({ ... }),
+   ),
```

::: note Configuration changes
The configuration of the AuthServices have changed slightly compared to the strategies, however they remain similar. Consulting the code completion should help to adapt.
:::

Replace `createAuthResolver` with the class name:

```diff title=api/src/auth/auth.module.ts
-   useClass: createCometAuthGuard([...]),
+   useClass: CometAuthGuard,
```

:::note Passport not supported anymore
`CometAuthGuard` does not support Passport strategies anymore. Consider rewriting or wrapping into `AuthServiceInterface`. However, you still can use passport strategies in conjunction with the provided `AuthGuard` from `@nestjs/passport`.
:::

Import `JwtModule` from `@nestjs/jwt`:

```diff title=api/src/auth/auth.module.ts
    exports: [UserService, AccessControlService],
+   imports: [JwtModule],
```

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

### Import `Tooltip` from `@comet/admin` package

```diff
- import { Tooltip } from "@mui/material";
+ import { Tooltip } from "@comet/admin";
```

### Update MUI - X Packages

In `package.json` update the version of the MUI X packages to `^7.22.3`.

```diff
- "@mui/x-data-grid": "^5.x.x",
- "@mui/x-data-grid-pro": "^5.x.x",
- "@mui/x-data-grid-premium": "^5.x.x",

+ "@mui/x-data-grid": "^7.22.3",
+ "@mui/x-data-grid-pro": "^7.22.3",
+ "@mui/x-data-grid-premium": "^7.22.3",
```

:::note Codemod

```sh
npx @comet/upgrade v8/mui-x-upgrade.ts
```

:::

A lots of props have been renamed from MUI, for a detailed look, see the official [migration guide v5 -> v6](https://mui.com/x/migration/migration-data-grid-v5) and [migration guide v6 -> v7](https://mui.com/x/migration/migration-data-grid-v6/). There is also a codemod from MUI which handles most of the changes:

! As well, be aware if you have a date in the data grid, you will need to add a `valueGetter`

```diff
    <DataGrid
        //other props
        columns=[
        {
            field: "updatedAt",
            type: "dateTime",
+            valueGetter: (params, row) => row.updatedAt && new Date(row.updatedAt)
        }]
    />
```

Also, be aware if you have a `valueGetter` or `valueFormatter` in the data grid, you will need to change the arguments passing to the functions. Previously, arguments were passed as an object. Now, they are passed directly as individual parameters

```diff
    <DataGrid
        //other props
        columns=[
        {
            field: "updatedAt",
            type: "dateTime",
-           valueGetter: ({params, row}) => row.updatedAt && new Date(row.updatedAt)
+           valueGetter: (params, row) => row.updatedAt && new Date(row.updatedAt)
-           valueFormatter: ({value}) => (value ? intl.formatDate(value, { dateStyle: "medium", timeStyle: "short" }) : ""),
+           valueFormatter: (value) => (value ? intl.formatDate(value, { dateStyle: "medium", timeStyle: "short" }) : ""),
        }]
    />
```

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

### Remove @comet/admin-react-select

```diff
- "@comet/admin-react-select": "^7.x.x",
```

It is recommended to use the `AutocompleteField` or the `SelectField` components from `@comet/admin` instead:

```diff
- import { FinalFormReactSelectStaticOptions } from "@comet/admin-react-select";
- <Field name="color" type="text" component={FinalFormReactSelectStaticOptions} fullWidth options={options} />;
+ import { AutocompleteField } from "@comet/admin";
+ <AutocompleteField name="color" label="Color" options={options} fullWidth />;
```

## ESLint

### Remove React barrel imports

Importing `React` is no longer necessary due to the new JSX transform, which automatically imports the necessary `react/jsx-runtime` functions.
Use individual named imports instead, e.g, `import { useState } from "react"`.

It is recommended to perform the following steps separately in the `admin/` and `site/` directories:

1. Replace `import * as React from "react";` with `import React from "react";` in your codebase (This step is optional but improves the results of the codemod).

2. Run the codemod to update React imports (option `--force` is required to because of changes of step one above):

    ```sh
    npx react-codemod update-react-imports --force
    ```

3. Run ESLint with the `--fix` option to automatically fix issues:
    ```sh
    npm run lint:eslint --fix
    ```

These steps will help automate the process of updating React imports and fixing linting issues, making the migration smoother.
The codemod does not handle all cases, so manual adjustments may still be necessary.
