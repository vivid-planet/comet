---
"@comet/cms-api": patch
---

Fix `MODULE_NOT_FOUND` errors caused by extensionless deep imports of `@nestjs/graphql` internals. `@nestjs/graphql` 13.3.0 tightened its `exports` map so that the `"./*": "./*"` pattern no longer maps to `.js` automatically. All deep imports of `@nestjs/graphql` internals now use explicit `.js` extensions.
