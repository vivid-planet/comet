"use client";

import { BlockPreviewProvider, IFrameBridgeProvider, useBlockPreviewFetch, useIFrameBridge } from "@comet/site-react";
import { PageContentBlock } from "@src/documents/pages/blocks/PageContentBlock";
import { StageBlock } from "@src/documents/pages/blocks/StageBlock";
import { FooterContentBlock } from "@src/layout/footer/blocks/FooterContentBlock";
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

export type BlockPreviewProps = {
    type: string;
};
export function BlockPreviewInner(props: BlockPreviewProps) {
    const rootBlockType = rootBlockTypes[props.type];
    const Component = rootBlockType.component;

    const iFrameBridge = useIFrameBridge();

    const { fetch, graphQLFetch } = useBlockPreviewFetch();

    const [blockData, setBlockData] = useState<any>();
    useEffect(() => {
        async function load() {
            if (!graphQLFetch) return;
            if (!iFrameBridge.block) {
                setBlockData(undefined);
                return;
            }
            const newData = await recursivelyLoadBlockData({
                blockType: rootBlockType.blockType,
                blockData: iFrameBridge.block,
                graphQLFetch,
                fetch,
            });
            setBlockData(newData);
        }
        load();
    }, [iFrameBridge.block, fetch, graphQLFetch, rootBlockType.blockType]);

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
