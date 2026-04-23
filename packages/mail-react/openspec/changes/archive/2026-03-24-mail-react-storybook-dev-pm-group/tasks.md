## 1. dev-pm configuration

- [x] 1.1 In the monorepo root `dev-pm.config.ts`, set the `storybook-mail-react` script’s `group` to `["mail-react"]` only (remove `"storybook"`).

## 2. Verification

- [x] 2.1 From the monorepo root, verify `@mail-react` starts `storybook-mail-react` and `@storybook` no longer includes it (e.g. inspect `dev-pm` config or run the groups and check which scripts start).
