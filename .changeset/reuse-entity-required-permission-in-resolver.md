---
"@comet/cms-api": minor
"@comet/api-generator": minor
---

Reuse `@RequiredPermission` from entity in resolver permissions

The `UserPermissionsGuard` now falls back to the entity's `@RequiredPermission` decorator when no permission is explicitly set on the resolver. The entity is resolved from the `@Resolver(() => Entity)` decorator.

Additionally, the CRUD generator no longer emits `@RequiredPermission` on generated resolvers if the entity already has `@RequiredPermission` set. This avoids redundant permission declarations.
