---
"@comet/cms-api": major
---

Remove deprecated `SkipBuildInterceptor`

The `SkipBuildInterceptor` was never intended to be part of the public API. If you want to skip a build for an operation, use the `@SkipBuild()` decorator instead.
