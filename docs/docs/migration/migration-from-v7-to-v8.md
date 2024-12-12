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

### Import `Tooltip` from `@comet/admin` package

```diff
- import { Tooltip } from "@mui/material";
+ import { Tooltip } from "@comet/admin";
```
