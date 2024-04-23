---
"@comet/cms-api": patch
---

Fix order of `@RequiredPermission()` decorators

Decorators defined on handlers should be considered before decorators defined on classes.
