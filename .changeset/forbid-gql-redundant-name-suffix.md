---
"@comet/eslint-config": major
---

Enable `@graphql-eslint/naming-convention` in `react.js` and `nextjs.js`

GraphQL code generation appends the operation kind (`Fragment`, `Query`, `Mutation`, `Subscription`) to the generated TypeScript type name. Naming an operation `FooFragment` / `FooQuery` therefore produces duplicated types like `GQLFooFragmentFragment` / `GQLFooQueryQuery`. The `@graphql-eslint/naming-convention` rule from `@graphql-eslint/eslint-plugin` reports such names inside `gql`/`graphql`-tagged template literals.
