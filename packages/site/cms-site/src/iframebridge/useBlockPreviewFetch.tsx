import { useEffect, useRef } from "react";

import { createFetchInMemoryCache } from "../graphQLFetch/fetchInMemoryCache";
import { createFetchWithPreviewHeaders, createGraphQLFetch } from "../graphQLFetch/graphQLFetch";
import { useIFrameBridge } from "./useIFrameBridge";

const cachingFetch = createFetchInMemoryCache(fetch);

export function useBlockPreviewFetch(graphqlApiUrl: string) {
    const iFrameBridge = useIFrameBridge();

    const graphQLFetchRef = useRef(
        createGraphQLFetch(createFetchWithPreviewHeaders(cachingFetch, { includeInvisible: !iFrameBridge.showOnlyVisible }), graphqlApiUrl),
    );
    useEffect(() => {
        graphQLFetchRef.current = createGraphQLFetch(
            createFetchWithPreviewHeaders(cachingFetch, { includeInvisible: !iFrameBridge.showOnlyVisible }),
            graphqlApiUrl,
        );
    }, [iFrameBridge.showOnlyVisible, graphqlApiUrl]);
    return {
        graphQLFetch: graphQLFetchRef.current,
        fetch: cachingFetch,
    };
}
