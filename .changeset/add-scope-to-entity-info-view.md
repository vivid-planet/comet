---
"@comet/cms-api": minor
---

Add entity scope to `EntityInfo` view and scope argument to `fullTextSearch`

The `EntityInfo` database view now includes a `scope` column (jsonb) that is automatically populated from:

- An embedded `scope` property on the entity (e.g., `@Embedded(() => MyScope) scope: MyScope`)
- A SQL-path `@ScopedEntity` decorator

**`@ScopedEntity` decorator extensions**

The `@ScopedEntity` decorator now supports SQL-convertible path definitions in addition to the existing callback/service format:

- String form: `@ScopedEntity("company.scope")` — path to an embedded scope object via a relation
- Object form: `@ScopedEntity({ domain: "company.scope.domain", language: "company.scope.language" })` — individual field paths

The old callback/service format is still supported but cannot be combined with `@EntityInfo` (since callbacks cannot be converted to SQL for the view).

**`fullTextSearch` scope argument**

The `fullTextSearch` GraphQL query now accepts an optional `scope` argument to restrict results to entities matching the given scope:

```graphql
query {
    fullTextSearch(search: "example", scope: { domain: "main", language: "en" }) {
        nodes {
            id
            entityName
            name
            scope
        }
        totalCount
    }
}
```

**`EntityInfo` GraphQL type**

The `EntityInfo` GraphQL type now includes a `scope` field (JSON object).
