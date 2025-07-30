---
"@comet/admin-color-picker": major
"@comet/admin-date-time": major
"@comet/admin-icons": major
"@comet/admin-rte": major
"@comet/cms-admin": major
"@comet/admin": major
---

Upgrade from MUI v5 to v7

This only causes minimal breaking changes, see the official migration guides from MUI for details:

- [Upgrade to MUI v6](https://mui.com/material-ui/migration/upgrade-to-v6/)
- [Upgrade to MUI v7](https://mui.com/material-ui/migration/upgrade-to-v7/)

To update the MUI dependencies, run the following command:

```sh
npx @comet/upgrade v8/update-mui-dependencies.ts
```

To run all of the recommended MUI codemods, run:

```sh
npx @comet/upgrade v8/mui-codemods.ts
```
