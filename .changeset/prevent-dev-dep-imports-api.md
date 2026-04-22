---
"@comet/eslint-config": minor
"@comet/brevo-api": patch
---

Prevent importing dev dependencies in the API

Add `import/no-extraneous-dependencies` rule with `devDependencies` restriction to the NestJS ESLint config, preventing accidental imports of dev-only packages in production source files. Dev dependencies may only be imported in test files and Jest configuration files.

Fix `@comet/brevo-api` to correctly declare `@nestjs/graphql`, `graphql`, `graphql-scalars`, `lodash.isequal`, and `uuid` as dependencies/peerDependencies instead of devDependencies, since they are imported in source code.
