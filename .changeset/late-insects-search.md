---
"@comet/cms-api": major
---

Move the `DiscoverService` from the `BlocksModule` to the new `DependenciesModule`

The `discoverRootBlocks()` method now also returns the `graphqlObjectType` of an entity. Furthermore, a `discoverTargetEntities()` method was added that returns information about all potential dependency targets.

