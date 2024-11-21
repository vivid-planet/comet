import { useEffect, useRef } from "react";

import { createFetchInMemoryCache } from "../graphQLFetch/fetchInMemoryCache";
import { convertPreviewDataToHeaders, createFetchWithDefaults, createGraphQLFetch } from "../graphQLFetch/graphQLFetch";
import { useIFrameBridge } from "./useIFrameBridge";

const cachingFetch = createFetchInMemoryCache(fetch);

export function useBlockPreviewFetch(graphqlApiUrl: string) {
    const iFrameBridge = useIFrameBridge();

    const graphQLFetchRef = useRef(createBlockPreviewFetch(graphqlApiUrl, !iFrameBridge.showOnlyVisible));
    useEffect(() => {
        graphQLFetchRef.current = createBlockPreviewFetch(graphqlApiUrl, !iFrameBridge.showOnlyVisible);
    }, [iFrameBridge.showOnlyVisible, graphqlApiUrl]);
    return {
        graphQLFetch: graphQLFetchRef.current,
        fetch: cachingFetch,
    };
}

function createBlockPreviewFetch(graphqlApiUrl: string, includeInvisible: boolean) {
    return createGraphQLFetch(createFetchWithDefaults(cachingFetch, { headers: convertPreviewDataToHeaders({ includeInvisible }) }), graphqlApiUrl);
}
