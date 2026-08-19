---
"@dextinity/eslint-plugin": minor
---

Support Oxlint in addition to ESLint

The rules are written against the ESLint rule API, which Oxlint implements for [JS plugins](https://oxc.rs/docs/guide/usage/linter/js-plugins). Load the plugin in `oxlint.config.mts`:

```js
export default {
    jsPlugins: [{ name: "@dextinity", specifier: "@dextinity/eslint-plugin" }],
    rules: {
        "@dextinity/no-other-module-relative-import": "warn",
    },
};
```

`eslint` and `oxlint` are optional peer dependencies now, the removed `prettier` peer dependency was never used.
