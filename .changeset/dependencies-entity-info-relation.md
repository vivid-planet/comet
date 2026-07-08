---
"@comet/cms-api": minor
"@comet/cms-admin": minor
---

Expose the related entity's info on dependencies through an `entityInfo` relation

The `Dependency` GraphQL type now exposes the related entity's `name` and `secondaryInformation` through a nested `entityInfo` field instead of flat top-level fields, matching how warnings expose it. Filtering by name and secondary information is done through a nested `entityInfo` field (an `EntityInfoFilter`) on `DependencyFilter` and `DependentFilter`.

Internally, the `block_index_dependencies` view no longer denormalizes the related entity's name and secondary information; they come from `targetEntityInfo` / `rootEntityInfo` relations to the `EntityInfo` view (the displayed entity is the target for a dependency and the root for a dependent). The view still joins `EntityInfo` to compute `visible`.

The admin `DependenciesList` and `DependentsList` read `entityInfo.name` / `entityInfo.secondaryInformation`; queries providing these lists must select the nested `entityInfo { name secondaryInformation }` instead of the flat fields.
