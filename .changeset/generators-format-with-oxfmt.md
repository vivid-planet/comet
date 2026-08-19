---
"@dextinity/admin-generator": major
"@dextinity/api-generator": major
"@dextinity/cli": major
---

Format generated files with Oxfmt instead of Prettier

`dextinity-api-generator`, `dextinity-admin-generator` and `dextinity generate-block-types` pick up the format options from the closest `.oxfmtrc.json` or `.oxfmtrc.jsonc` instead of the closest `.prettierrc`.

**Migration**

Add [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) to the project and create an `.oxfmtrc.json`. Migrate your existing Prettier configuration with:

```bash
pnpm exec oxfmt --migrate prettier
```

Rerun the generators afterwards, the formatting of the generated files changes slightly.
