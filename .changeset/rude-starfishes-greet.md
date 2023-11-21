---
"@comet/eslint-config": minor
---

Add a new eslint rule that makes sure no private sibling imports are used

Sibling File is eg a Foo.gql.ts file that should be considered as private sibling of Foo.ts and not used (imported) by any other file
