---
"@comet/cms-api": minor
---

Remove availablePermissions from UserPermissionsModule

The `Permission`-interface and the `availablePermissions`-setting can simply be removed from the application.
There is a `CometPermission`-export available to avoid using strings for the library-defined permissions. This object
can be extended in the application to provide all permissions centralized:

```
export const Permissions = {
    ...CometPermissions,
    products: "products",
} as const;
```
