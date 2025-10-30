---
"@comet/api-generator": patch
---

Cleanup dependencies

- Make `@mikro-orm/core` and `@mikro-orm/postgresql` peer dependencies
- Make `typescript` a dependency
- Exclude `test-helper.ts` from build and leave `prettier` as dev dependency

This shouldn't have any noticeable effect.
