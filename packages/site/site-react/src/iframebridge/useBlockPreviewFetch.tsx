"use client";

import { useEffect, useState } from "react";

import { createFetchInMemoryCache } from "../graphQLFetch/fetchInMemoryCache";
import { convertPreviewDataToHeaders, createFetchWithDefaults, createGraphQLFetch, type GraphQLFetch } from "../graphQLFetch/graphQLFetch";
import { useIFrameBridge } from "./useIFrameBridge";

const cachingFetch = createFetchInMemoryCache(fetch);

type Fetch = typeof fetch;

/**
 * @deprecated Use useBlockPreviewFetch() without argument instead
 * @param apiUrl the API URL
 */
export function useBlockPreviewFetch(apiUrl: string): { fetch: Fetch; graphQLFetch: GraphQLFetch };
export function useBlockPreviewFetch(apiUrl?: string | undefined): { fetch: Fetch; graphQLFetch?: GraphQLFetch };
export function useBlockPreviewFetch(apiUrl?: string | undefined) {
    const { showOnlyVisible, graphQLApiUrl } = useIFrameBridge();
    const [graphQLFetch, setGraphQLFetch] = useState<GraphQLFetch | undefined>(() =>
        apiUrl ? createBlockPreviewFetch(apiUrl, !showOnlyVisible) : undefined,
    );

    useEffect(() => {
        if (graphQLApiUrl) {
            // We need to use an updater function here because createBlockPreviewFetch's return value would otherwise be incorrectly treated as an updater function.
            setGraphQLFetch(() => createBlockPreviewFetch(graphQLApiUrl, !showOnlyVisible));
        }
    }, [showOnlyVisible, graphQLApiUrl]);

    return {
        graphQLFetch,
        fetch: cachingFetch,
    };
}

function createBlockPreviewFetch(graphqlApiUrl: string, includeInvisible: boolean) {
    return createGraphQLFetch(
        createFetchWithDefaults(cachingFetch, { headers: convertPreviewDataToHeaders({ includeInvisible }), credentials: "include" }),
        graphqlApiUrl,
    );
}
