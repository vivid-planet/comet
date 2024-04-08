import * as React from "react";

import { createFetchInMemoryCache } from "../graphQLFetch/fetchInMemoryCache";
import { createFetchWithPreviewHeaders, createGraphQLFetch } from "../graphQLFetch/graphQLFetch";
import { useIFrameBridge } from "./useIFrameBridge";

const cachingFetch = createFetchInMemoryCache(fetch);

export function useBlockPreviewFetch(graphqlApiUrl: string) {
    const iFrameBridge = useIFrameBridge();

    const clientRef = React.useRef(
        createGraphQLFetch(createFetchWithPreviewHeaders(cachingFetch, { includeInvisible: !iFrameBridge.showOnlyVisible }), graphqlApiUrl),
    );
    React.useEffect(() => {
        clientRef.current = createGraphQLFetch(
            createFetchWithPreviewHeaders(cachingFetch, { includeInvisible: !iFrameBridge.showOnlyVisible }),
            graphqlApiUrl,
        );
    }, [iFrameBridge.showOnlyVisible, graphqlApiUrl]);
    return {
        graphQLFetch: clientRef.current,
        fetch: cachingFetch,
    };
}
