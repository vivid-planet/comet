---
"@comet/cms-api": minor
---

Add entity scope to EntityInfo view and scope argument to fullTextSearch

- The `EntityInfo` database view now includes a `scope` JSONB column. Scope is automatically resolved from:
    - Entities with a direct `scope` embedded property
    - Entities with `@ScopedEntity` using the new SQL-mappable formats
- `@ScopedEntity` decorator now supports SQL-convertible formats in addition to callbacks/services:
    - `@ScopedEntity({ domain: "company.scope.domain", language: "company.scope.language" })` — Record mapping of scope keys to entity field paths
    - `@ScopedEntity("company.scope")` — String path to a related entity's scope property
    - Old callback/service formats are still supported but cannot be used together with `@EntityInfo` (a warning is logged)
- `fullTextSearch` GraphQL query now accepts an optional `scope` argument (JSONObject) to filter results by scope
- New exports: `isScopedEntityCallbackOrService`, `isScopedEntityRelationPath`, `isScopedEntitySqlMapping`, `EntityScopeServiceInterface`, `ScopedEntitySqlMapping`
