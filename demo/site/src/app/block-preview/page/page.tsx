"use client";
import { BlockPreviewProvider, IFrameBridgeProvider, useBlockPreviewFetch, useIFrameBridge } from "@comet/cms-site";
import { PageContentBlockData } from "@src/blocks.generated";
import { PageContentBlock } from "@src/blocks/PageContentBlock";
import { recursivelyLoadBlockData } from "@src/recursivelyLoadBlockData";
import { useEffect, useState } from "react";

const PreviewPage = () => {
    const iFrameBridge = useIFrameBridge();

    const { fetch, graphQLFetch } = useBlockPreviewFetch();

    const [blockData, setBlockData] = useState<PageContentBlockData>();
    useEffect(() => {
        async function load() {
            if (!iFrameBridge.block) {
                setBlockData(undefined);
                return;
            }
            const newData = await recursivelyLoadBlockData({
                blockType: "PageContent",
                blockData: iFrameBridge.block,
                graphQLFetch,
                fetch,
                pageTreeNodeId: undefined, //we don't have a pageTreeNodeId in preview
            });
            setBlockData(newData);
        }
        load();
    }, [iFrameBridge.block, fetch, graphQLFetch]);

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
