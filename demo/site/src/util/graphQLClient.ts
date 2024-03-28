import { createFetchWithDefaults, createFetchWithPreviewHeaders, createGraphQLFetch as createGraphQLFetchLibrary } from "@comet/cms-site";
import { SitePreviewData } from "@src/app/api/site-preview/route";

const graphQLApiUrl = `${typeof window === "undefined" ? process.env.API_URL_INTERNAL : process.env.NEXT_PUBLIC_API_URL}/graphql`;
export function createGraphQLFetch(previewData?: SitePreviewData) {
    return createGraphQLFetchLibrary(
        createFetchWithDefaults(createFetchWithPreviewHeaders(fetch, previewData), { next: { revalidate: 15 * 60 } }),
        graphQLApiUrl,
    );
}
