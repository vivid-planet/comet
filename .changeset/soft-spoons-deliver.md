---
"@comet/cms-site": minor
---

gql: Handle non-string variables in GraphQL documents

Non-string variables were incorrectly converted to strings, e.g., `'[object Object]'`. This error usually occurred when trying to import a GraphQL fragment from a React Client Component. The `gql` helper now throws an error for non-string variables.
