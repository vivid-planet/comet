"use client";

import { useBlockPreviewFetch, useIFrameBridge } from "@comet/cms-site";
import { PageContentBlockData } from "@src/blocks.generated";
import { PageContentBlock } from "@src/blocks/PageContentBlock";
import { recursivelyLoadBlockData } from "@src/recursivelyLoadBlockData";
import { withBlockPreview } from "@src/util/blockPreview";
import { useEffect, useState } from "react";

export default withBlockPreview(() => {
    const iFrameBridge = useIFrameBridge();

    const { fetch, graphQLFetch } = useBlockPreviewFetch();

    const [blockData, setBlockData] = useState<PageContentBlockData>();
    useEffect(() => {
        async function load() {
            if (!graphQLFetch) return;
            if (!iFrameBridge.block) {
                setBlockData(undefined);
                return;
            }
            const newData = await recursivelyLoadBlockData({
                blockType: "PageContent",
                blockData: iFrameBridge.block,
                graphQLFetch,
                fetch,
            });
            setBlockData(newData);
        }
        load();
    }, [iFrameBridge.block, fetch, graphQLFetch]);

    return <div>{blockData && <PageContentBlock data={blockData} />}</div>;
});