---
"@dextinity/admin-color-picker": major
---

Rename `@comet/admin-color-picker` to `@dextinity/admin-color-picker`

Update the dependency in `package.json` and all imports.

**Breaking changes**

- Rename the theme component prefix from `CometAdmin` to `DextinityAdmin`. This affects `components` overrides passed to `createDextinityTheme` and the generated CSS class names
