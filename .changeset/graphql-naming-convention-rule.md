---
"@dextinity/eslint-plugin": minor
---

Add `graphql-naming-convention` rule

The rule reports operation names ending in `Query`, `Mutation` or `Subscription` and fragment names ending in `Fragment` in `gql` template literals:

```ts
// Reports: Forbidden suffix "Query" in query name "ProductsQuery"
const productsQuery = gql`
    query ProductsQuery {
        products {
            id
        }
    }
`;
```

It replaces `@graphql-eslint/naming-convention` for Oxlint, which can't extract GraphQL documents from template literals because it has no ESLint processors. The forbidden suffixes and the template literal tags are configurable.
