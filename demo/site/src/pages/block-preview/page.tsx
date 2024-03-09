import { BlockPreviewProvider, buildGraphqlClientHeaders, IFrameBridgeProvider, PreviewData, useIFrameBridge } from "@comet/cms-site";
import { PageContentBlockData } from "@src/blocks.generated";
import { PageContentBlock } from "@src/blocks/PageContentBlock";
import { recursivelyLoadBlockData } from "@src/recursivelyLoadBlockData";
import createGraphQLClient from "@src/util/createGraphQLClient";
import { RequestConfig } from "graphql-request/build/esm/types";
import * as React from "react";

const fetchCache: Record<string, Response> = {};

async function cachingFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
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

function createCachingGraphQLClient(requestConfig: RequestConfig & { previewData?: PreviewData } = {}) {
    const client = createGraphQLClient({
        fetch: cachingFetch,
        ...requestConfig,
    });
    return client;
}

function useGraphQLClient() {
    const iFrameBridge = useIFrameBridge();
    const clientRef = React.useRef(
        createCachingGraphQLClient({
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

const PreviewPage: React.FunctionComponent = () => {
    const iFrameBridge = useIFrameBridge();
    const client = useGraphQLClient();
    const [blockData, setBlockData] = React.useState<PageContentBlockData>();
    React.useEffect(() => {
        async function load() {
            if (!iFrameBridge.block) {
                setBlockData(undefined);
                return;
            }
            const newData = await recursivelyLoadBlockData({ blockType: "PageContent", blockData: iFrameBridge.block, client, fetch: cachingFetch });
            setBlockData(newData);
        }
        load();
    }, [iFrameBridge.block, client]);

    return <div>{blockData && <PageContentBlock data={blockData} />}</div>;
};
const IFrameBridgePreviewPage = (): JSX.Element => {
    return (
        <IFrameBridgeProvider>
            <BlockPreviewProvider>
                <PreviewPage />
            </BlockPreviewProvider>
        </IFrameBridgeProvider>
    );
};

export default IFrameBridgePreviewPage;
