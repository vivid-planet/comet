import { createFetchWithPreviewHeaders, createGraphQLFetch } from "@comet/cms-site";
import { SitePreviewData } from "@src/app/api/site-preview/route";

export const graphQLApiUrl = `${typeof window === "undefined" ? process.env.API_URL_INTERNAL : process.env.NEXT_PUBLIC_API_URL}/graphql`;
export function createGraphQLFetchWithPreviewHeaders(previewData?: SitePreviewData) {
    return createGraphQLFetch(createFetchWithPreviewHeaders(fetch, previewData), graphQLApiUrl);
}
