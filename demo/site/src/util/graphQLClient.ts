import {
    convertPreviewDataToHeaders,
    createFetchWithDefaults,
    createGraphQLFetch as createGraphQLFetchLibrary,
    type SitePreviewData,
} from "@comet/cms-site";

export function createGraphQLFetch(previewData?: SitePreviewData) {
    if (typeof window !== "undefined") {
        throw new Error("createGraphQLFetch: cannot use on client side.");
    }

    const headers = {
        authorization: `Basic ${Buffer.from(`vivid:${process.env.API_PASSWORD}`).toString("base64")}`,
    };

    return createGraphQLFetchLibrary(
        // set a default revalidate time of 7.5 minutes to get an effective cache duration of 15 minutes if a CDN cache is enabled
        // see cache-handler.ts for maximum cache duration (24 hours)
        createFetchWithDefaults(fetch, { next: { revalidate: 7.5 * 60 }, headers: { ...convertPreviewDataToHeaders(previewData), ...headers } }),
        `${process.env.API_URL_INTERNAL}/graphql`,
    );
}
