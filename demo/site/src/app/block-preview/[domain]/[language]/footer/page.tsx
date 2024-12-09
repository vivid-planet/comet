"use client";

import { BlockPreviewProvider, IFrameBridgeProvider, useBlockPreviewFetch, useIFrameBridge } from "@comet/cms-site";
import { FooterContentBlockData } from "@src/blocks.generated";
import { FooterContentBlock } from "@src/documents/pages/blocks/FooterContentBlock";
import { recursivelyLoadBlockData } from "@src/recursivelyLoadBlockData";
import { graphQLApiUrl } from "@src/util/graphQLClient";
import { useEffect, useState } from "react";

const PreviewPage = () => {
    const iFrameBridge = useIFrameBridge();

    const { fetch, graphQLFetch } = useBlockPreviewFetch(graphQLApiUrl);

    const [blockData, setBlockData] = useState<FooterContentBlockData>();
    useEffect(() => {
        async function load() {
            if (!iFrameBridge.block) {
                setBlockData(undefined);
                return;
            }
            const newData = await recursivelyLoadBlockData({
                blockType: "FooterContent",
                blockData: iFrameBridge.block,
                graphQLFetch,
                fetch,
            });
            setBlockData(newData);
        }
        load();
    }, [iFrameBridge.block, fetch, graphQLFetch]);

    return <div>{blockData && <FooterContentBlock data={blockData} />}</div>;
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
