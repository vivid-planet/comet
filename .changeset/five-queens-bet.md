---
"@comet/cms-api": minor
---

Allow passing an array to the `AppPermission` parameter of the `UserPermissionsModule`

This is useful if you use another package (e.g., `@comet/brevo-api`) that exports its own permissions enum, and you need to merge all the permissions together.

```diff title="api/src/app.module.ts"
UserPermissionsModule.forRootAsync({
    // ...
-   AppPermission: AppPermission,
+   AppPermission: [AppPermission, BrevoPermission],
}),
```

**Note:** This only merges the enums at runtime to create the correct GraphQL schema.
You also need to add `BrevoPermission` to the `PermissionOverrides` to get the correct type:

```diff title="api/src/auth/permission.interface.ts"
declare module "@comet/cms-api" {
    export interface PermissionOverrides {
-       app: AppPermission;
+       app: AppPermission | BrevoPermission;
    }
}
```
