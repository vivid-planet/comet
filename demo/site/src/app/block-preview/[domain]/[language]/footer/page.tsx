"use client";

import { BlockPreviewProvider, IFrameBridgeProvider, useIFrameBridge } from "@comet/cms-site";
import { FooterContentBlockData } from "@src/blocks.generated";
import { FooterContentBlock } from "@src/layout/footer/blocks/FooterContentBlock";
import { recursivelyLoadBlockData } from "@src/recursivelyLoadBlockData";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { useEffect, useState } from "react";

const PreviewPage = () => {
    const iFrameBridge = useIFrameBridge();

    const graphQLFetch = createGraphQLFetch();

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
    }, [iFrameBridge.block, graphQLFetch]);

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
