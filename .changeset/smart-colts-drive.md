---
"@comet/cms-admin": minor
---

Add `DependencyInterface` 

The `DependencyInterface` must be implemented for entities to be displayed correctly in the `DependencyList`. 
The implementation must then be passed to the `DependenciesConfigProvider`.

You can use one of the helper methods to implement the `resolvePath()` method required by `DependencyInterface`:

- `createDocumentDependencyMethods()` for documents
- `createDependencyMethods()` for all other entities

You can find more information in [the docs](https://docs.comet-dxp.com/docs/dependencies/).
