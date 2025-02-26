---
"@comet/admin": major
---

Merge `@comet/admin-theme` into `@comet/admin`

The following exports have been moved from `@comet/admin-theme` to `@comet/admin`: `breakpointsOptions`, `breakpointValues`, `createCometTheme`, `createTypographyOptions`, `errorPalette`, `greyPalette`, `infoPalette`, `paletteOptions`, `primaryPalette`, `shadows`, `successPalette`, `warningPalette`.

`@mui/utils` has been added as a peer dependency.

**Migrating your project**

1. Remove the `@comet/admin-theme` dependency from your project

2. Add the `@mui/utils` dependency to your project

3. Change all imports from `@comet/admin-theme` to `@comet/admin`

```diff
-import { createCometTheme } from "@comet/admin-theme";
+import { createCometTheme } from "@comet/admin";

 const theme = createCometTheme();
```

4. Remove the no longer required type overrides that were previously required for the custom `Typography` variants, typically located in `admin/src/vendors.d.ts`

```diff
-/// <reference types="@comet/admin-theme" />
```
