"use client";

import { BlockPreviewProvider, IFrameBridgeProvider, useBlockPreviewFetch, useIFrameBridge } from "@comet/site-nextjs";
import { type NavigationCallToActionButtonListContentBlockData } from "@src/blocks.generated";
import { CallToActionListBlock } from "@src/common/blocks/CallToActionListBlock";
import { type ContentScope } from "@src/site-configs";
import { recursivelyLoadBlockData } from "@src/util/recursivelyLoadBlockData";
import { type FunctionComponent, useEffect, useState } from "react";

const PreviewPage: FunctionComponent = () => {
    const iFrameBridge = useIFrameBridge();

    const { fetch, graphQLFetch } = useBlockPreviewFetch();

    const [blockData, setBlockData] = useState<NavigationCallToActionButtonListContentBlockData>();
    useEffect(() => {
        async function load() {
            if (!graphQLFetch) return;
            if (!iFrameBridge.block) {
                setBlockData(undefined);
                return;
            }
            const newData = await recursivelyLoadBlockData({
                blockType: "NavigationCallToActionButtonListContent",
                blockData: iFrameBridge.block,
                graphQLFetch,
                fetch,
                scope: iFrameBridge.contentScope as ContentScope,
            });
            setBlockData(newData);
        }
        load();
    }, [iFrameBridge.block, fetch, graphQLFetch, iFrameBridge.contentScope]);

    return <div>{blockData && <CallToActionListBlock data={blockData} />}</div>;
};

const IFrameBridgePreviewPage = () => {
    return (
        <IFrameBridgeProvider>
            <BlockPreviewProvider>
                <PreviewPage />
            </BlockPreviewProvider>
        </IFrameBridgeProvider>
    );
};

export default IFrameBridgePreviewPage;
