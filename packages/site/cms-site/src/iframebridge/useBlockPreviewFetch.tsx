import { useEffect, useRef } from "react";

import { createFetchInMemoryCache } from "../graphQLFetch/fetchInMemoryCache";
import { createFetchWithPreviewHeaders, createGraphQLFetch } from "../graphQLFetch/graphQLFetch";
import { useIFrameBridge } from "./useIFrameBridge";

const cachingFetch = createFetchInMemoryCache(fetch);

export function useBlockPreviewFetch() {
    const { showOnlyVisible, graphQLApiUrl } = useIFrameBridge();

    const graphQLFetchRef = useRef(
        createGraphQLFetch(createFetchWithPreviewHeaders(cachingFetch, { includeInvisible: !showOnlyVisible }), graphQLApiUrl),
    );
    useEffect(() => {
        graphQLFetchRef.current = createGraphQLFetch(
            createFetchWithPreviewHeaders(cachingFetch, { includeInvisible: !showOnlyVisible }),
            graphQLApiUrl,
        );
    }, [showOnlyVisible, graphQLApiUrl]);
    return {
        graphQLFetch: graphQLFetchRef.current,
        fetch: cachingFetch,
    };
}
