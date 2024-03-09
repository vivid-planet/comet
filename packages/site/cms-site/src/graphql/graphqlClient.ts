import { fetch } from "cross-fetch";
import { GraphQLClient } from "graphql-request";
import { RequestConfig } from "graphql-request/build/esm/types";
import React from "react";

import { useIFrameBridge } from "../iframebridge/useIFrameBridge";
import { PreviewData } from "../sitePreview/SitePreviewApiHelper";

export function buildGraphqlClientHeaders(previewData?: PreviewData) {
    const { includeInvisibleBlocks, includeInvisiblePages, previewDamUrls } = {
        includeInvisiblePages: !!previewData,
        includeInvisibleBlocks: previewData && previewData.includeInvisible,
        previewDamUrls: !!previewData,
    };

    const headers: Record<string, string> = {};

    const includeInvisibleContentHeaderEntries: string[] = [];

    if (includeInvisiblePages) {
        includeInvisibleContentHeaderEntries.push("Pages:Unpublished");
    }

    if (includeInvisibleBlocks) {
        includeInvisibleContentHeaderEntries.push("Blocks:Invisible");
    }

    // tells api to send invisble content
    // authentication is required when this header is used
    if (includeInvisibleContentHeaderEntries.length > 0) {
        headers["x-include-invisible-content"] = includeInvisibleContentHeaderEntries.join(",");
    }

    // tells api to create preview image urls
    // authentication is required when this header is used
    if (previewDamUrls) {
        headers["x-preview-dam-urls"] = "1";
    }
    return headers;
}

export function createGraphQLClient(url: string, requestConfig: RequestConfig & { previewData?: PreviewData } = {}): GraphQLClient {
    const headers = buildGraphqlClientHeaders(requestConfig.previewData);
    return new GraphQLClient(url, {
        ...requestConfig,
        headers,
    });
}

const fetchCache: Record<string, Response> = {};

export async function inMemoryCachingFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    let cacheKey: string | undefined;
    if (init?.method?.toUpperCase() === "GET") {
        //cache all get requests
        cacheKey = input.toString();
    } else if (init?.body) {
        const body = JSON.parse(init.body.toString());
        if (body.query && body.variables) {
            //looks like a gql query, cache any method
            cacheKey = `${input.toString()}#${init.body.toString()}`;
        }
    }
    if (!cacheKey) {
        return fetch(input, init);
    }

    const cachedResponse = fetchCache[cacheKey];
    if (cachedResponse) {
        return cachedResponse.clone();
    } else {
        const fetchPromise = fetch(input, init);
        const response = await fetchPromise;
        fetchCache[cacheKey] = response.clone();
        return fetchPromise;
    }
}

export function useBlockPreviewGraphQLClient(url: string) {
    const iFrameBridge = useIFrameBridge();
    const clientRef = React.useRef(
        createGraphQLClient(url, {
            fetch: inMemoryCachingFetch,
            previewData: { includeInvisible: !iFrameBridge.showOnlyVisible },
        }),
    );
    React.useEffect(() => {
        //update headers when showOnlyVisible changes
        clientRef.current.setHeaders(
            buildGraphqlClientHeaders({
                includeInvisible: !iFrameBridge.showOnlyVisible,
            }),
        );
    }, [iFrameBridge.showOnlyVisible]);
    return clientRef.current;
}
