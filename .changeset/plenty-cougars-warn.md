---
"@comet/cms-site": minor
---

Add GraphQL fetch client

- `createGraphQLFetch`: simple graphql client around fetch, usage: createGraphQLFetch(fetch, url)(gql, variables)
- `type GraphQLFetch = <T, V>(query: string, variables?: V, init?: RequestInit) => Promise<T>`
- `gql` for tagging queries
- `createFetchWithPreviewHeaders` fetch decorator that adds comet preview headers (based on SitePreviewData)

Example helper in application:
```
export const graphQLApiUrl = `${typeof window === "undefined" ? process.env.API_URL_INTERNAL : process.env.NEXT_PUBLIC_API_URL}/graphql`;
export function createGraphQLFetchWithPreviewHeaders(previewData?: SitePreviewData) {
    return createGraphQLFetch(createFetchWithPreviewHeaders(fetch, previewData), graphQLApiUrl);
}
```

Usage example:
```
const graphqlFetch = createGraphQLFetchWithPreviewHeaders(previewData);
const data = await graphqlFetch<GQLExampleQuery, GQLExampleQueryVariables>(
    exampleQuery,
    {
        exampleVariable: "foo"
    },
    { next: { revalidate: 3 } },
);
```