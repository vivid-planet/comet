import { createGraphQLClient as libraryCreateGraphQLClient, inMemorySwrCachingFetch, PreviewData } from "@comet/cms-site";
import { GraphQLClient } from "graphql-request";

type RequestConfig = ConstructorParameters<typeof GraphQLClient>[1]; //graphql-request doesn't export RequestConfig

export function createGraphQLClient(options?: RequestConfig & { previewData?: PreviewData }) {
    return libraryCreateGraphQLClient(`${process.env.API_URL_INTERNAL}/graphql`, options);
}

export const fetch =
    typeof window === "undefined"
        ? inMemorySwrCachingFetch //server side: caching fetch
        : window.fetch; //client side: default fetch
export const graphqlClient = createGraphQLClient({
    fetch,
});
