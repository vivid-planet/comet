---
"@comet/eslint-config": minor
---

Enable `@graphql-eslint/naming-convention` in `future/{react,nextjs}.js`

GraphQL code generation appends the operation kind (`Fragment`, `Query`, `Mutation`, `Subscription`) to the generated TypeScript type name. Naming an operation `FooFragment` / `FooQuery` therefore produces duplicated types like `GQLFooFragmentFragment` / `GQLFooQueryQuery`. The `@graphql-eslint/naming-convention` rule from `@graphql-eslint/eslint-plugin` reports such names inside `gql`/`graphql`-tagged template literals.

The rule is opt-in via `@comet/eslint-config/future/{react,nextjs}.js` and will be enabled by default with the next major release of `@comet/eslint-config`.
