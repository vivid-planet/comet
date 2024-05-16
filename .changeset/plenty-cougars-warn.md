---
"@comet/cms-site": minor
---

Add GraphQL fetch client

-   `createGraphQLFetch`: simple graphql client around fetch, usage: createGraphQLFetch(fetch, url)(gql, variables)
-   `type GraphQLFetch = <T, V>(query: string, variables?: V, init?: RequestInit) => Promise<T>`
-   `gql` for tagging queries
-   `createFetchWithDefaults` fetch decorator that adds default values (eg. headers or next.revalidate)
-   `createFetchWithPreviewHeaders` fetch decorator that adds comet preview headers (based on SitePreviewData)

Example helper in application:

```
export const graphQLApiUrl = `${typeof window === "undefined" ? process.env.API_URL_INTERNAL : process.env.NEXT_PUBLIC_API_URL}/graphql`;
export function createGraphQLFetch() {
    return createGraphQLFetchLibrary(
        createFetchWithDefaults(createFetchWithPreviewHeaders(fetch), { next: { revalidate: 15 * 60 } }),
        graphQLApiUrl,
    );

}
```

Usage example:

```
const graphqlFetch = createGraphQLFetch();
const data = await graphqlFetch<GQLExampleQuery, GQLExampleQueryVariables>(
    exampleQuery,
    {
        exampleVariable: "foo"
    }
);
```
