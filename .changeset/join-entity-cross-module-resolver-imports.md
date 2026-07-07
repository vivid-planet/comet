---
"@comet/api-generator": patch
---

Fix broken imports in generated relation resolver for cross-module join entities

When an entity with `@CrudGenerator` had a `@OneToMany` relation to an explicit join entity located in a different module, the generated relation resolver for the join entity was emitted into the referencing entity's module with import paths that assumed the join entity lived in that same module. The resulting file did not compile.

The join-entity resolver is now written into the module that owns the join entity, where its imports resolve correctly.
