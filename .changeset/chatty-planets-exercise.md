---
"@comet/cms-admin": minor
---

Add support for different scopes to `createDependencyMethods()`, `createDocumentDependencyMethods()` and `DependencyList`

You can now pass a `scopeFragment` to `createDependencyMethods()` and `createDocumentDependencyMethods()` to load the dependency's scope.
The loaded scope is then passed to `basePath` where you must attach it to the URL.

The `DependencyList` now checks if the scope is already in the URL and only prepends the current scope if needed.

This is helpful when the DAM is not or only partially scoped.
Otherwise, users might encounter 404 errors when dependencies are in a different scope than currently selected.
