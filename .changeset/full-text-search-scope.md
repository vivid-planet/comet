---
"@comet/cms-api": minor
---

Add scope support to `myFullTextSearch`

The `EntityInfoFullText` view now includes a `scopes` column, and the `myFullTextSearch` query accepts an optional `scope` argument to restrict results to a single content scope.

The scopes are derived from either a `scope` property on the entity (simple case) or the `@ScopedEntity` decorator. To support building the scopes in SQL, `@ScopedEntity` accepts a new declarative, SQL-convertible variant in addition to the existing callback/service:

```ts
// Field path to the scope object (an embeddable)
@ScopedEntity("company.scope")

// Object mapping scope properties to field paths
@ScopedEntity({ companyId: "company.id" })

// Multiple scopes
@ScopedEntity(["company.scope", "otherCompany.scope"])
```

The existing callback and service variants keep working everywhere `@ScopedEntity` is used (e.g. the auth guard). They cannot be converted to SQL, so an entity that is part of the full-text index must use the declarative variant (or have a `scope` property) — otherwise creating the `EntityInfoFullText` view throws.
