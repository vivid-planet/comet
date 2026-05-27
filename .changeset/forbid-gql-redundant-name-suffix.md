---
"@comet/eslint-plugin": minor
"@comet/eslint-config": minor
---

Add `no-gql-redundant-name-suffix` ESLint rule

GraphQL code generation appends the operation kind (`Fragment`, `Query`, `Mutation`, `Subscription`) to the generated TypeScript type name. Naming an operation `FooFragment` / `FooQuery` therefore produces duplicated types like `GQLFooFragmentFragment` / `GQLFooQueryQuery`. The new `@comet/no-gql-redundant-name-suffix` rule reports such names inside `gql`-tagged template literals.

The rule is opt-in via `@comet/eslint-config/future/{react,nextjs}.js` and will be enabled by default with the next major release of `@comet/eslint-config`.
