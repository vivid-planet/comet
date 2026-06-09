---
"@comet/cms-api": patch
---

Fix `EntityInfoFullText` view not being created when using `FullTextSearchModule`

`DependenciesService` injects `FullTextSearchService` as an optional dependency to create the `EntityInfoFullText` view. Because `FullTextSearchModule` was not `@Global`, the service was not available in the (global) `DependenciesModule`'s injection scope, so the optional dependency always resolved to `undefined` and the view was silently never created.

Mark `FullTextSearchModule` as `@Global` so `FullTextSearchService` is resolvable and the `EntityInfoFullText` view is created by `createBlockIndexViews`.
