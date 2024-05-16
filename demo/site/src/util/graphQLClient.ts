import {
    createFetchWithDefaults,
    createFetchWithPreviewHeaders,
    createGraphQLFetch as createGraphQLFetchLibrary,
    previewParams,
    SitePreviewData,
} from "@comet/cms-site";

const isServerSide = typeof window === "undefined";
export const graphQLApiUrl = `${isServerSide ? process.env.API_URL_INTERNAL : process.env.NEXT_PUBLIC_API_URL}/graphql`;
export async function createGraphQLFetch() {
    const headers = isServerSide
        ? {
              authorization: `Basic ${Buffer.from(`vivid:${process.env.API_PASSWORD}`).toString("base64")}`,
          }
        : undefined;
    let previewData: SitePreviewData | undefined = undefined;
    if (isServerSide) {
        if ((await previewParams())?.previewData?.includeInvisible) {
            previewData = { includeInvisible: true };
        }
    }
    return createGraphQLFetchLibrary(
        createFetchWithDefaults(createFetchWithPreviewHeaders(fetch, previewData), { next: { revalidate: 15 * 60 }, headers }),
        graphQLApiUrl,
    );
}
