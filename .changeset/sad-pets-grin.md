---
"@comet/site-nextjs": minor
---

Add functionality for persisted queries on client side

- createPersistedQueryGraphQLFetch: GraphQLFetch implementation that calls BFF api route with hash
- persistedQueryRoute: BFF api route that get called by above fetch and forwards query to api
- @comet/site-next/webpackPersistedQueriesLoader: webpack loader that turns client side queries into hash
