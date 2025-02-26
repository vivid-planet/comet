import { useEffect, useState } from "react";

import { createFetchInMemoryCache } from "../graphQLFetch/fetchInMemoryCache";
import { convertPreviewDataToHeaders, createFetchWithDefaults, createGraphQLFetch, GraphQLFetch } from "../graphQLFetch/graphQLFetch";
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
