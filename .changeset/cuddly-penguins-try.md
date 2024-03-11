---
"@comet/cms-api": minor
---

Support using a service in `@ScopedEntity()` decorator

This can be useful when an entity's scope cannot be derived directly from the passed entity.
For example, a `Page` document's scope is derived by the `PageTreeNode` the document is attached to, but there is no database relation between the two entities.

For page tree document types you can use the provided `PageTreeNodeDocumentEntityScopeService`.
