---
"@comet/cms-api": minor
"@comet/api-generator": minor
---

Fall back to entity's `requiredPermission` from `@EntityInfo` when no `@RequiredPermission` decorator is set on a resolver. The entity is resolved using the class-level `@Resolver(() => EntityName)` decorator.

The api-generator no longer outputs `@RequiredPermission` in generated resolvers when the entity already has `requiredPermission` set in its `@EntityInfo` decorator.
