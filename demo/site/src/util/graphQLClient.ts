import { createFetchWithPreviewHeaders, createGraphQLFetch } from "@comet/cms-site";
import { SitePreviewData } from "@src/app/api/site-preview/route";

type Fetch = typeof fetch;

export const graphQLApiUrl = `${typeof window === "undefined" ? process.env.API_URL_INTERNAL : process.env.NEXT_PUBLIC_API_URL}/graphql`;
export function createGraphQLFetchWithPreviewHeaders(fetch: Fetch, previewData?: SitePreviewData) {
    return createGraphQLFetch(createFetchWithPreviewHeaders(fetch, previewData), graphQLApiUrl);
}
