import {
    convertPreviewDataToHeaders,
    createFetchWithDefaults,
    createGraphQLFetch as createGraphQLFetchLibrary,
    type SitePreviewData,
} from "@comet/cms-site";

import { getVisibilityParam } from "./ServerContext";

export function createGraphQLFetch() {
    if (typeof window !== "undefined") {
        throw new Error("createGraphQLFetch: cannot use on client side.");
    }
    if (process.env.NEXT_RUNTIME === "edge") {
        throw new Error("createGraphQLFetch: cannot use in edge runtime, use createGraphQLFetchMiddleware instead.");
    }

    let previewData: SitePreviewData | undefined;
    const visibilityParam = getVisibilityParam();
    if (visibilityParam === "invisibleBlocks") previewData = { includeInvisible: true };
    if (visibilityParam === "invisiblePages") previewData = { includeInvisible: false };

    return createGraphQLFetchLibrary(
        // set a default revalidate time of 7.5 minutes to get an effective cache duration of 15 minutes if a CDN cache is enabled
        // see cache-handler.ts for maximum cache duration (24 hours)
        createFetchWithDefaults(fetch, {
            next: {
                revalidate: 7.5 * 60,
            },
            headers: {
                authorization: `Basic ${Buffer.from(`system-user:${process.env.BASIC_AUTH_SYSTEM_USER_PASSWORD}`).toString("base64")}`,
                ...convertPreviewDataToHeaders(previewData),
            },
        }),
        `${process.env.API_URL_INTERNAL}/graphql`,
    );
}
