import {
    convertPreviewDataToHeaders,
    createFetchWithDefaults,
    createGraphQLFetch as createGraphQLFetchLibrary,
    createPersistedQueryGraphQLFetch,
} from "@comet/site-react";
import type { SitePreviewParams } from "@src/futureLib/previewUtils";
import type { AsyncLocalStorage } from "async_hooks";

type Fetch = typeof fetch;

let fetchWithRedisCache: Fetch;
let sitePreviewParamsStorage: AsyncLocalStorage<SitePreviewParams>;
if (import.meta.env.SSR) {
    fetchWithRedisCache = (await import("./fetchWithRedisCache")).fetchWithRedisCache;
    sitePreviewParamsStorage = (await import("./sitePreview")).sitePreviewParamsStorage;
}

export function createGraphQLFetch({ fetch: passedFetch }: { fetch?: Fetch } = {}) {
    if (!import.meta.env.SSR) {
        // Client-side rendering
        return createPersistedQueryGraphQLFetch(
            passedFetch || fetch,
            `/graphql`, // bff api route
        );
    } else {
        // Server-side rendering
        if (!process.env.API_BASIC_AUTH_SYSTEM_USER_PASSWORD) {
            throw new Error("API_BASIC_AUTH_SYSTEM_USER_PASSWORD is not set");
        }

        const sitePreviewParams = sitePreviewParamsStorage.getStore();
        const eventualCachingFetch = sitePreviewParams ? fetch : fetchWithRedisCache;

        return createGraphQLFetchLibrary(
            createFetchWithDefaults(eventualCachingFetch, {
                headers: {
                    authorization: `Basic ${Buffer.from(`system-user:${process.env.API_BASIC_AUTH_SYSTEM_USER_PASSWORD}`).toString("base64")}`,
                    ...convertPreviewDataToHeaders(sitePreviewParams?.previewData),
                },
            }),
            `${process.env.API_URL_INTERNAL}/graphql`,
        );
    }
}
