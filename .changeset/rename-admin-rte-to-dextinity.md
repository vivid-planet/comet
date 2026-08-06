---
"@dextinity/admin-rte": major
---

Rename `@comet/admin-rte` to `@dextinity/admin-rte`

Update the dependency in `package.json` and all imports.

**Breaking changes**

- Rename the theme component prefix from `CometAdmin` to `DextinityAdmin`. This affects `components` overrides passed to `createDextinityTheme` and the generated CSS class names
- Rename the `--comet-admin-rte-outer-border-color` CSS variable to `--dextinity-admin-rte-outer-border-color`
