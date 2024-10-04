---
"@comet/admin-color-picker": major
"@comet/admin-react-select": major
"@comet/admin-date-time": major
"@comet/blocks-admin": major
"@comet/admin-icons": major
"@comet/admin-theme": major
"@comet/admin-rte": major
"@comet/cms-admin": major
"@comet/admin": major
---

Migrate to MUI v6

This only causes minimal breaking changes, see the official [migration guide](https://mui.com/material-ui/migration/upgrade-to-v6/) for details.

It is recommended to run the following codemods in your application:

```sh
npx @mui/codemod@latest v6.0.0/list-item-button-prop admin/src
npx @mui/codemod@latest v6.0.0/styled admin/src
npx @mui/codemod@latest v6.0.0/sx-prop admin/src
npx @mui/codemod@latest v6.0.0/theme-v6 admin/src/theme.ts
```
