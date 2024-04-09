---
"@comet/cms-api": major
---

Refactor auth-decorators

-   Remove `@PublicApi()`-decorator
-   Rename `@DisableGlobalGuard()`-decorator to `@DisableCometGuards()`

The `@DisableCometGuards()`-decorator will only disable the AuthGuard when no `x-include-invisible-content`-header is set.
