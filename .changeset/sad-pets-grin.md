---
"@comet/site-nextjs": minor
---

Add functionality for persisted queries on client side

- `createPersistedQueryGraphQLFetch`: GraphQLFetch implementation that calls the BFF Route Handler with an operation ID (hash)
- `persistedQueryRoute`: BFF Route Handler that gets called by the above fetch and forwards the query to the API
- `@comet/site-nextjs/webpackPersistedQueriesLoader`: webpack loader that turns client-side queries into an operation ID (hash)
