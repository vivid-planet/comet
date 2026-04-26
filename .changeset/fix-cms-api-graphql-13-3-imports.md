---
"@comet/cms-api": patch
---

Fix `MODULE_NOT_FOUND` errors caused by extensionless deep imports of `@nestjs/graphql` internals in `PartialType`. `@nestjs/graphql` 13.3.0 tightened its `exports` map so that the `"./*": "./*"` pattern no longer maps to `.js` automatically. The deep imports of `plugin-constants`, `get-fields-and-decorator.util` and `type-helpers.utils` now use explicit `.js` extensions.
