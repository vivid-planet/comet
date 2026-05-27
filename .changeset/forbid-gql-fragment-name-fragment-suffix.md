---
"@comet/eslint-plugin": minor
"@comet/eslint-config": minor
---

Add `no-gql-fragment-name-suffix` ESLint rule

GraphQL code generation appends `Fragment` to the generated type name. Naming a fragment `FooFragment` therefore produces a duplicated `GQLFooFragmentFragment` type. The new rule reports fragment names ending with `Fragment` inside `gql`-tagged template literals and is enabled in `@comet/eslint-config`.
