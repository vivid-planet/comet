import { BlockPreviewProvider, IFrameBridgeProvider, useIFrameBridge } from "@comet/cms-site";
import { PageContentBlockData } from "@src/blocks.generated";
import { PageContentBlock } from "@src/blocks/PageContentBlock";
import { recursivelyLoadBlockData } from "@src/recursivelyLoadBlockData";
import createGraphQLClient, { buildGraphqlClientHeaders, GraphQLClientOptions } from "@src/util/createGraphQLClient";
import { RequestDocument, Variables } from "graphql-request";
import * as React from "react";

function createCachingGraphQLClient(options: Partial<GraphQLClientOptions> = {}) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cache: Record<string, any> = {};

    const client = createGraphQLClient(options);
    const originalRequest = client.request.bind(client);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function requestWithCache<T = any, V = Variables>(
        document: RequestDocument,
        variables?: V,
        requestHeaders?: RequestInit["headers"],
    ): Promise<T> {
        const documentString = typeof document === "string" ? document : document.loc?.source.body;
        const cacheKey = JSON.stringify({ documentString, variables });

        let result = cache[cacheKey];
        if (result) {
            return result;
        } else {
            result = await originalRequest(document, variables, requestHeaders);
            cache[cacheKey] = result;
        }
        return result;
    }
    client.request = requestWithCache;
    return client;
}

const PreviewPage: React.FunctionComponent = () => {
    const iFrameBridge = useIFrameBridge();
    React.useEffect(() => {
        //update headers when showOnlyVisible changes
        clientRef.current.setHeaders(
            buildGraphqlClientHeaders({
                previewDamUrls: true,
                includeInvisibleBlocks: !iFrameBridge.showOnlyVisible,
                includeInvisiblePages: true,
            }),
        );
    }, [iFrameBridge.showOnlyVisible]);

    const clientRef = React.useRef(
        createCachingGraphQLClient({
            previewDamUrls: true,
            includeInvisibleBlocks: !iFrameBridge.showOnlyVisible,
            includeInvisiblePages: true,
        }),
    );
    const [blockData, setBlockData] = React.useState<PageContentBlockData>();
    React.useEffect(() => {
        async function load() {
            if (!iFrameBridge.block) {
                setBlockData(undefined);
                return;
            }
            const newData = await recursivelyLoadBlockData({ blockType: "PageContent", blockData: iFrameBridge.block, client: clientRef.current });
            setBlockData(newData);
        }
        load();
    }, [iFrameBridge.block]);

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
