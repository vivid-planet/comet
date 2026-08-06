---
"@dextinity/eslint-config": major
---

Rename `@comet/eslint-config` to `@dextinity/eslint-config`

Update the dependency in `package.json` and the imports in your ESLint configuration:

```diff
- import eslintConfigReact from "@comet/eslint-config/future/react.js";
+ import eslintConfigReact from "@dextinity/eslint-config/future/react.js";
```

**Breaking changes**

- Rename the plugin namespace from `@comet` to `@dextinity`. Rule overrides and disable comments must be updated, for instance, `@comet/no-other-module-relative-import` -> `@dextinity/no-other-module-relative-import`
