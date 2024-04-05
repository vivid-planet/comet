import * as React from "react";

import { createFetchInMemoryCache } from "../graphQLFetch/fetchInMemoryCache";
import { createFetchWithPreviewHeaders, createGraphQLFetch } from "../graphQLFetch/graphQLFetch";
import { useIFrameBridge } from "./useIFrameBridge";

const cachingFetch = createFetchInMemoryCache(fetch);

export function useBlockPreviewFetch(url: string) {
    const iFrameBridge = useIFrameBridge();

    const clientRef = React.useRef(
        createGraphQLFetch(createFetchWithPreviewHeaders(cachingFetch, { includeInvisible: !iFrameBridge.showOnlyVisible }), url),
    );
    React.useEffect(() => {
        clientRef.current = createGraphQLFetch(createFetchWithPreviewHeaders(cachingFetch, { includeInvisible: !iFrameBridge.showOnlyVisible }), url);
    }, [iFrameBridge.showOnlyVisible, url]);
    return {
        graphQLFetch: clientRef.current,
        fetch: cachingFetch,
    };
}
