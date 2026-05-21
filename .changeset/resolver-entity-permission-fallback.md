---
"@comet/cms-api": minor
---

Fall back to entity's `requiredPermission` (from `@CrudGenerator` or `@EntityInfo`) when no `@RequiredPermission` decorator is set on a resolver. The entity is resolved using the class-level `@Resolver(() => EntityName)` decorator.
