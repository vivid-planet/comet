import { createGraphQLClient as libraryCreateGraphQLClient, PreviewData } from "@comet/cms-site";
import { RequestConfig } from "graphql-request/build/esm/types";

export function createGraphQLClient(requestConfig: RequestConfig & { previewData?: PreviewData } = {}) {
    return libraryCreateGraphQLClient(graphqlApiUrl, requestConfig);
}

export const graphqlApiUrl = `${typeof window === "undefined" ? process.env.API_URL_INTERNAL : process.env.NEXT_PUBLIC_API_URL}/graphql`;
