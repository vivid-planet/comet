---
title: Migrating from v7 to v8
sidebar_position: -8
---

# Migrating from v7 to v8

First, execute `npx @comet/upgrade@latest v8` in the root of your project.
It automatically installs the new versions of all `@comet` libraries, runs an ESLint autofix and handles some of the necessary renames.

<details>

<summary>Changes handled by @comet/upgrade</summary>

- Upgrade MUI packages to v6
- Run MUI codemods
- Upgrade MUI X packages to v6
- Upgrade NestJS packages to v10
- Upgrade Prettier to v3

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

#### MikroORM

The MikroORM peer dependency has been bumped to v6.

1.  Upgrade all your dependencies:

    ```diff title=api/package.json
    {
        "dependencies": {
    -   "@mikro-orm/cli": "^5.9.8",
    -   "@mikro-orm/core": "^5.9.8",
    -   "@mikro-orm/migrations": "^5.9.8",
    -   "@mikro-orm/nestjs": "^5.2.3",
    -   "@mikro-orm/postgresql": "^5.9.8",
    +   "@mikro-orm/cli": "^6.4.0",
    +   "@mikro-orm/core": "^6.4.0",
    +   "@mikro-orm/migrations": "^6.4.0",
    +   "@mikro-orm/nestjs": "^6.0.2",
    +   "@mikro-orm/postgresql": "^6.4.0",
        },
    }
    ```

    :::note Codemod available

    ```sh
    npx @comet/upgrade v8/update-mikro-orm-dependencies.ts
    ```

    :::

2.  Follow the official [migration guide](https://mikro-orm.io/docs/upgrading-v5-to-v6) to upgrade.

    :::note Codemods available

    We provide upgrade scripts for basic migrations.
    Please note that these scripts might not cover all necessary migrations.

    Remove generic from `BaseEntity`:

    ```sh
    npx @comet/upgrade v8/mikro-orm-base-entity-generic.ts
    ```

    Rename `customType` to `type`:

    ```sh
    npx @comet/upgrade v8/mikro-orm-custom-type.ts
    ```

    Rename `onDelete` to `deleteRule`:

    ```sh
    npx @comet/upgrade v8/mikro-orm-delete-rule.ts
    ```

    Add a `mikro-orm` script with a dotenv call to `package.json`:

    ```sh
    npx @comet/upgrade v8/mikro-orm-dotenv.ts
    ```

    Change all imports from `@mikro-orm/core` to `@mikro-orm/postgresql`:

    ```sh
    npx @comet/upgrade v8/mikro-orm-imports.ts
    ```

    Wrap config in `defineConfig`:

    ```sh
    npx @comet/upgrade v8/mikro-orm-ormconfig.ts
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

#### Sentry

1. Upgrade the "@sentry/node" dependency in your `package.json` file:

```diff title=api/package.json
{
    "dependencies": {
-       "@sentry/node": "^7.0.0",
+       "@sentry/node": "^8.0.0",
    },
}
```

2. Update your `main.ts` file to remove all `Sentry.Handlers` and add `Sentry.setupExpressErrorHandler(app)`:

```diff
-   app.use(Sentry.Handlers.requestHandler());
-   app.use(Sentry.Handlers.tracingHandler());
-   app.use(Sentry.Handlers.errorHandler());
+   Sentry.setupExpressErrorHandler(app);
```

### NestJS peer dependencies

Peer dependencies defined by NestJS have been added as peer dependencies to `@comet/cms-api`.
To upgrade, install the dependencies in your project:

```diff title=api/package.json
{
    "dependencies": {
+       "class-transformer": "^0.5.1",
-       "reflect-metadata": "^0.1.13",
+       "reflect-metadata": "^0.2.2",
-       "rxjs": "^7.0.0",
+       "rxjs": "^7.8.1",
    }
}
```

:::note Codemod available

```sh
npx @comet/upgrade v8/nest-peer-dependencies.ts
```

:::

### Remove `@comet/blocks-api`

The `@comet/blocks-api` package has been merged into the `@comet/cms-api` package.
To upgrade, perform the following steps:

1.  Remove the package:

    ```diff title="api/package.json"
    - "@comet/blocks-api": "^7.x.x",
    ```

    :::note Codemod available

    ```sh
    npx @comet/upgrade v8/remove-blocks-packages.ts
    ```

    :::

2.  Update all your imports from `@comet/blocks-api` to `@comet/cms-api`

    :::note Codemod available

    ```sh
    npx @comet/upgrade v8/merge-blocks-api-into-cms-api.ts
    ```

    :::

3.  Update imports that have been renamed

    :::note Codemod available

    ```sh
    npx @comet/upgrade v8/merge-blocks-api-into-cms-api.ts
    ```

    :::

4.  Remove usages of removed export `getFieldKeys` (probably none)

## Admin

### Upgrade peer dependencies

#### Recommended: React 18

Support for React 18 has been added.
While optional, it is recommended to upgrade to React 18 in the project.

1. Upgrade all your dependencies:

    ```diff title=admin/package.json
    {
        "dependencies": {
    -       "react": "^17.0.2",
    -       "react-dom": "^17.0.2",
    +       "react": "^18.3.1",
    +       "react-dom": "^18.3.1"
        },
        "devDependencies": {
    -       "@types/react": "^17.0.83",
    -       "@types/react-dom": "^17.0.26",
    +       "@types/react": "^18.3.18",
    +       "@types/react-dom": "^18.3.5"
        }
    }
    ```

    :::note Codemod available

    ```sh
    npx @comet/upgrade v8/update-react-dependencies.ts
    ```

    :::

2. Follow the official [migration guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide) to upgrade.

    :::tip

    Use [types-react-codemod](https://github.com/eps1lon/types-react-codemod) to fix potential TypeScript compile errors when upgrading to `@types/react@^18.0.0`.

    :::

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

### Remove `trigger` prop from `Tooltip`

The `trigger` prop has been removed. The combined `hover`/`focus` trigger is now the only supported behavior.

Example:

```diff
<Tooltip
- trigger="hover"
></Tooltip>
```

### Import `Dialog` from `@comet/admin` package

```diff
- import { Dialog } from "@mui/material";
+ import { Dialog } from "@comet/admin";
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

### Remove `@comet/blocks-admin`

The `@comet/blocks-admin` package has been merged into the `@comet/cms-admin` package.
To upgrade, perform the following steps:

1.  Remove the package:

    ```diff title="admin/package.json"
    - "@comet/blocks-admin": "^7.x.x",
    ```

    :::note Codemod available

    ```sh
    npx @comet/upgrade v8/remove-blocks-packages.ts
    ```

    :::

2.  Update all your imports from `@comet/blocks-admin` to `@comet/cms-admin`

    :::note Codemod available

    ```sh
    npx @comet/upgrade v8/merge-blocks-admin-into-cms-admin.ts
    ```

    :::

3.  Update imports that have been renamed

    :::note Codemod available

    ```sh
    npx @comet/upgrade v8/merge-blocks-admin-into-cms-admin.ts
    ```

    :::

4.  Remove usages of removed exports `CannotPasteBlockDialog`, `ClipboardContent`, `useBlockClipboard`, `Collapsible`, `CollapsibleSwitchButtonHeader`, `usePromise`, `DispatchSetStateAction`, `SetStateAction`, and `SetStateFn`

    :::tip

    Use `Dispatch<SetStateAction<T>>` from `react` instead of `DispatchSetStateAction`.

    :::

### Add `DialogContent` to `EditDialog`

The `DialogContent` inside `EditDialog` has been removed.
To maintain the existing styling of `EditDialog`, such as for forms and text, manually wrap the content with `DialogContent`. This ensures proper spacing.
For grids or other elements that already handle their own spacing (e.g., `DataGrid`), adding `DialogContent` is not necessary.

```diff
    <EditDialog>
    //...
+       <DialogContent>
+           //...
+       </DialogContent>
    // ...
    </EditDialog>
```

## ESLint

### ESLint upgrade from v8 to v9 with ESM

Update ESLint to v9

`package.json`

```diff
- "eslint": "^8.0.0",
+ "eslint": "^9.0.0",
```

An ESM compatible ESLint config is required. Delete the related `.eslintrc.json` and move the configured rules to the new ESLint flat configuration `eslint.config.mjs`.

Migration Guide of ESLint 9.0 can be found here: [Migration Guide](https://eslint.org/docs/latest/use/migrate-to-9.0.0)

#### `admin/eslint.config.mjs`

```
import cometConfig from "@comet/eslint-config/react.js";

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["schema.json", "src/fragmentTypes.json", "dist/**", "src/**/*.generated.ts"],
    },
    ...cometConfig
];

export default config;
```

#### `api/eslint.config.mjs`

```
import cometConfig from "@comet/eslint-config/react.js";

/** @type {import('eslint')} */
import cometConfig from "@comet/eslint-config/nestjs.js";

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["src/db/migrations/**", "dist/**", "src/**/*.generated.ts"],
    },
    ...cometConfig,
];

export default config;
```

#### `site/eslint.config.mjs`

```
import cometConfig from "@comet/eslint-config/react.js";

/** @type {import('eslint')} */
import cometConfig from "@comet/eslint-config/nextjs.js";

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["**/**/*.generated.ts", "dist/**", "lang/**", "lang-compiled/**", "lang-extracted/**", ".next/**", "public/**"],
    },
    ...cometConfig,
];

export default config;

```

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

### Consistent type imports

To improve code consistency and readability, we now enforce the ESLint rule [@typescript-eslint/consistent-type-imports](https://typescript-eslint.io/rules/consistent-type-imports/) with the following configuration:

```typescript
"@typescript-eslint/consistent-type-imports": [
  "error",
  {
    "prefer": "type-imports",
    "disallowTypeAnnotations": false,
    "fixStyle": "inline-type-imports"
  }
]
```

#### Why this change?

This rule ensures that TypeScript type-only imports are explicitly marked with import type, leading to multiple benefits:

- **Improved Code Clarity**
  It is immediately clear that the imported symbol is used only for TypeScript type checking and not at runtime.
  Avoids confusion between runtime imports and purely static type definitions.
- **Performance & Tree-Shaking**
  TypeScript can optimize build performance since it knows which imports are needed only at compile time.
  Some bundlers can more effectively remove unused type imports, reducing bundle size.
- **Reduced Circular Dependency Issues**
  Circular dependencies can cause hard-to-debug issues in TypeScript projects.
  Using import type ensures that types do not introduce unintended runtime dependencies.

#### Migration Steps

Run ESLint with the --fix option to automatically update imports:

```bash
npm run lint:eslint --fix
```
