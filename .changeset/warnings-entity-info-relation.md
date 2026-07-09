---
"@comet/cms-api": minor
"@comet/cms-admin": minor
---

Resolve warning name and secondary information via an `entityInfo` relation

The warning's related entity info (name, secondary information) is now resolved through a MikroORM relation on the `Warning` entity instead of a hand-built query builder join with field remapping — the same mechanism the full-text search module uses. Two read-only columns (`rootEntityName`, `targetId`) are generated from the warning's `sourceInfo` and used as the relation's join keys.

On the GraphQL API, `name` and `secondaryInformation` move from the top level of `WarningFilter` into a nested `EntityInfoFilter` (`WarningFilter.entityInfo`), matching where they already live on the `Warning` type. Sorting by `name` is unchanged.

A migration adds the generated join columns and replaces the previous JSONB-expression join index with one on those columns.
