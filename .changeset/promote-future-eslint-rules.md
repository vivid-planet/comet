---
"@comet/eslint-config": major
---

Promote `future/*` ESLint rules into the main configs

The rules previously only available via `@comet/eslint-config/future/*` are now part of the main configs and apply by default. The `future/*` subpaths are kept as aliases that re-export the main configs, so existing imports continue to work without changes.

**Newly active rules in the main configs**

- `react.js`:
    - `react/jsx-no-literals` (with a small allowlist of common symbols)
    - `@typescript-eslint/consistent-type-exports`
    - `formatjs/enforce-default-message` is now enforced as `"literal"`
- `nextjs.js`:
    - `node-cache` is restricted via `no-restricted-imports`
- `nestjs.js`:
    - `node-cache` is restricted via `no-restricted-imports` (and `restrictedImportPaths` is now exported)
- All configs:
    - `@comet/no-gql-fragment-name-suffix` forbids GraphQL fragment names ending with `Fragment`, which would otherwise produce duplicated `FragmentFragment` types via code generation
