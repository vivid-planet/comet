---
"@dextinity/admin": major
---

Rename `@comet/admin` to `@dextinity/admin`

Update the dependency in `package.json` and all imports:

```diff
- import { MainContent } from "@comet/admin";
+ import { MainContent } from "@dextinity/admin";
```

**Breaking changes**

- Rename `createCometTheme` to `createDextinityTheme`
- Rename the theme component prefix from `CometAdmin` to `DextinityAdmin`. This affects `components` overrides passed to `createDextinityTheme`, the `name` passed to `useThemeProps` in custom components and the generated CSS class names (`.CometAdminClearInputAdornment-root` -> `.DextinityAdminClearInputAdornment-root`)
- Rename the CSS variables from `--comet-admin-*` to `--dextinity-admin-*`, for instance, `--comet-admin-master-layout-content-top-spacing` -> `--dextinity-admin-master-layout-content-top-spacing`
- Remove the `CometLogo` component. Use `DextinityLogo` from `@dextinity/admin-icons` instead
