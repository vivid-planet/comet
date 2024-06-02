---
title: Permissions in Admin
sidebar_position: 3
---

:::caution
Please be aware that there is no access control possible in the admin panel. You have to check every permission and scope in the API. The following functions only assist for showing the correct user interface.
:::

### CurrentUserProvider

The `CurrentUserProvider` loads the current User from the API and provides the following Hooks:

**useCurrentUser**

You can use this hook to access the current user.

:::note
The current user object provides `allowedContentScopes` which may be used for the content scope selector.
:::

:::info
Try not to use the permissions field of the current user object directly as this is subject to change in future versions.
:::

**useUserPermissionCheck**

This hook provides a function that behaves like the `isAllowed` function in the API.

```ts
const isAllowed = useUserPermissionCheck();
if (isAllowed("pageTree")) {
    // ...
}
```

:::info
Since this function also checks the content scope, it requires the `ContentScopeProvider` in the rendering tree.
:::

### MasterMenuData

The `MasterMenuData` data type provides a unified format for

-   the `menu` prop in `MasterMenu`
-   the `menu` prop in `MasterMenuRoutes`

Regarding user permissions, `MasterMenuData` also provides a `requiredPermission` field. Both of the mentioned components use this field to filter the data.
