import { useEffect, useRef } from "react";

import { createFetchInMemoryCache } from "../graphQLFetch/fetchInMemoryCache";
import { convertPreviewDataToHeaders, createFetchWithDefaults, createGraphQLFetch } from "../graphQLFetch/graphQLFetch";
import { useIFrameBridge } from "./useIFrameBridge";

const cachingFetch = createFetchInMemoryCache(fetch);

export function useBlockPreviewFetch() {
    const { showOnlyVisible, graphQLApiUrl } = useIFrameBridge();

    const graphQLFetchRef = useRef(createBlockPreviewFetch(graphQLApiUrl, !showOnlyVisible));
    useEffect(() => {
        graphQLFetchRef.current = createBlockPreviewFetch(graphQLApiUrl, !showOnlyVisible);
    }, [showOnlyVisible, graphQLApiUrl]);
    return {
        graphQLFetch: graphQLFetchRef.current,
        fetch: cachingFetch,
    };
}

function createBlockPreviewFetch(graphqlApiUrl: string | undefined, includeInvisible: boolean) {
    if (!graphqlApiUrl) return undefined;
    return createGraphQLFetch(createFetchWithDefaults(cachingFetch, { headers: convertPreviewDataToHeaders({ includeInvisible }) }), graphqlApiUrl);
}
