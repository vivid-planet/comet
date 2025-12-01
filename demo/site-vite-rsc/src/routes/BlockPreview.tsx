"use client";

import { BlockPreviewProvider, createFetchInMemoryCache, IFrameBridgeProvider, useIFrameBridge } from "@comet/site-react";
import { PageContentBlock } from "@src/documents/pages/blocks/PageContentBlock";
import { StageBlock } from "@src/documents/pages/blocks/StageBlock";
import { FooterContentBlock } from "@src/layout/footer/blocks/FooterContentBlock";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { recursivelyLoadBlockData } from "@src/util/recursivelyLoadBlockData";
import { type ComponentType, useEffect, useState } from "react";

const rootBlockTypes: Record<string, { blockType: string; component: ComponentType<{ data: any }> }> = {
    page: {
        blockType: "PageContent",
        component: PageContentBlock,
    },
    footer: {
        blockType: "FooterContent",
        component: FooterContentBlock,
    },
    stage: {
        blockType: "FooterContent",
        component: StageBlock,
    },
};

const cachingFetch = createFetchInMemoryCache(fetch);

export type BlockPreviewProps = {
    type: string;
};
export function BlockPreviewInner(props: BlockPreviewProps) {
    const rootBlockType = rootBlockTypes[props.type];
    const Component = rootBlockType.component;

    const iFrameBridge = useIFrameBridge();

    const [blockData, setBlockData] = useState<any>();
    useEffect(() => {
        async function load() {
            if (!iFrameBridge.block) {
                setBlockData(undefined);
                return;
            }
            const graphQLFetch = createGraphQLFetch({ fetch: cachingFetch });

            const newData = await recursivelyLoadBlockData({
                blockType: rootBlockType.blockType,
                blockData: iFrameBridge.block,
                graphQLFetch,
                fetch: cachingFetch,
            });
            setBlockData(newData);
        }
        load();
    }, [iFrameBridge.block, rootBlockType.blockType]);

    return <div>{blockData && <Component data={blockData} />}</div>;
}

export function BlockPreview(props: BlockPreviewProps) {
    return (
        <IFrameBridgeProvider>
            <BlockPreviewProvider>
                <BlockPreviewInner {...props} />
            </BlockPreviewProvider>
        </IFrameBridgeProvider>
    );
}
