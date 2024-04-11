import { createFetchWithDefaults, createFetchWithPreviewHeaders, createGraphQLFetch as createGraphQLFetchLibrary } from "@comet/cms-site";
import { SitePreviewData } from "@src/app/api/site-preview/route";

const isServerSide = typeof window === "undefined";
export const graphQLApiUrl = `${isServerSide ? process.env.API_URL_INTERNAL : process.env.NEXT_PUBLIC_API_URL}/graphql`;
export function createGraphQLFetch(previewData?: SitePreviewData) {
    const headers = isServerSide
        ? {
              authorization: `Basic ${Buffer.from(`vivid:${process.env.API_PASSWORD}`).toString("base64")}`,
          }
        : undefined;
    return createGraphQLFetchLibrary(
        createFetchWithDefaults(createFetchWithPreviewHeaders(fetch, previewData), { next: { revalidate: 15 * 60 }, headers }),
        graphQLApiUrl,
    );
}
