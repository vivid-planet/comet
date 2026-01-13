---
"@comet/brevo-api": minor
---

Make this package compatible with [COMET v8](https://docs.comet-dxp.com/docs/migration-guide/migration-from-v7-to-v8)

Now requires

- `@comet/cms-api` >= `8.0.0`
- `@mikro-orm/*` >= `6.0.0`
- `@nestjs/*` >= `11.0.0`
- `reflect-metadata` >= `0.2.0`

You must add `BrevoPermission` to your `AppPermission`:

```diff title="api/src/auth/app-permission.enum.ts"
+   import { BrevoPermission } from "@comet/brevo-api";
    import { registerEnumType } from "@nestjs/graphql";

-   export enum AppPermission {
+   enum BaseAppPermission {
        news = "news",
        products = "products",
        manufacturers = "manufacturers",
    }

+   export const AppPermission = { ...BaseAppPermission, ...BrevoPermission } as const;
+   export type AppPermission = BaseAppPermission | BrevoPermission;
```
