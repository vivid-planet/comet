---
"@comet/cms-api": minor
---

Add scope column to EntityInfoFullText view and scope filtering to fullTextSearch query

- The `EntityInfoFullText` view now includes a `scope` column (JSONB) that is automatically populated from the entity's embedded scope or `@ScopedEntity` decorator
- The `fullTextSearch` GraphQL query accepts an optional `scope` argument to filter results by content scope
- `@ScopedEntity` decorator now supports SQL-resolvable variants: a string path to an embedded scope object (e.g., `@ScopedEntity("scope")`) or an object mapping (e.g., `@ScopedEntity({ domain: "scope.domain", language: "scope.language" })`)
- Entities with `@EntityInfo({ fullText: ... })` that use a callback/service-based `@ScopedEntity` will now throw an error at startup. Migrate to the SQL-resolvable format instead.
