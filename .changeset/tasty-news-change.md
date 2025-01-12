---
"@comet/cms-api": minor
---

Add `ExceptionFilter` to replace `ExceptionInterceptor`

The main motivation for this change was that the `ExceptionInterceptor` didn't capture exceptions thrown in guards. This could lead to information leaks, e.g., details about the database schema or the underlying code. This is considered a security risk.

The `ExceptionFilter` also catches error within guards. The error format remains unchanged.

Switching from the `ExceptionInterceptor` to the `ExceptionFilter` must be done in the project:

```diff
// main.ts

- app.useGlobalInterceptors(new ExceptionInterceptor(config.debug));
+ app.useGlobalFilters(new ExceptionFilter(config.debug));
```
