---
"@comet/cms-api": major
---

Refactor auth-decorators

-   Remove `@PublicApi()`-decorator
-   Rename `@DisableGlobalGuard()`-decorator to `@DisableCometGuards()`

When using the `@DisableCometGuards()`-decorator it's not allowed to send a `x-include-invisible-content`-header.
