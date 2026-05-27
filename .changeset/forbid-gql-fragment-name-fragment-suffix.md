---
"@comet/eslint-plugin": minor
"@comet/eslint-config": minor
---

Add `no-gql-fragment-name-suffix` ESLint rule

GraphQL code generation appends `Fragment` to the generated type name. Naming a fragment `FooFragment` therefore produces a duplicated `GQLFooFragmentFragment` type. The new `@comet/no-gql-fragment-name-suffix` rule reports fragment names ending with `Fragment` inside `gql`-tagged template literals.

The rule is opt-in via `@comet/eslint-config/future/*` for now and will be enabled by default with the next major release of `@comet/eslint-config`.
