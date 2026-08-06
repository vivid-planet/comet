---
"@dextinity/admin-date-time": major
---

Rename `@comet/admin-date-time` to `@dextinity/admin-date-time`

Update the dependency in `package.json` and all imports.

**Breaking changes**

- Rename the theme component prefix from `CometAdmin` to `DextinityAdmin`. This affects `components` overrides passed to `createDextinityTheme` and the generated CSS class names
