---
"@comet/eslint-config": major
---

Promote `future/*` ESLint configs into the main configs

The rules previously only available via `@comet/eslint-config/future/*` are now part of the main configs and apply by default. Import paths under `@comet/eslint-config/future/*` have been removed.

**Migration**

Replace imports from the `future` subpath with the main configs:

```diff
-import eslintConfigReact from "@comet/eslint-config/future/react.js";
+import eslintConfigReact from "@comet/eslint-config/react.js";

-import eslintConfigNextJs from "@comet/eslint-config/future/nextjs.js";
+import eslintConfigNextJs from "@comet/eslint-config/nextjs.js";

-import eslintConfigNestJs from "@comet/eslint-config/future/nestjs.js";
+import eslintConfigNestJs from "@comet/eslint-config/nestjs.js";
```

**Newly active rules**

- `react.js`:
    - `react/jsx-no-literals` (with a small allowlist of common symbols)
    - `@typescript-eslint/consistent-type-exports`
    - `formatjs/enforce-default-message` is now enforced as `"literal"`
- `nextjs.js`:
    - `node-cache` is restricted via `no-restricted-imports`
- `nestjs.js`:
    - `node-cache` is restricted via `no-restricted-imports` (and `restrictedImportPaths` is now exported)
