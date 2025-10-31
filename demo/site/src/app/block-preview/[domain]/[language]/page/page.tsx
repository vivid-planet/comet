"use client";

import { useIFrameBridge } from "@comet/site-nextjs";
import { type PageContentBlockData } from "@src/blocks.generated";
import { PageContentBlock } from "@src/documents/pages/blocks/PageContentBlock";
import { withBlockPreview } from "@src/util/blockPreview";
import { recursivelyLoadBlockDataBlockPreview } from "@src/util/recursivelyLoadBlockData";
import { useEffect, useState } from "react";

export default withBlockPreview(() => {
    const iFrameBridge = useIFrameBridge();

    const [blockData, setBlockData] = useState<PageContentBlockData>();
    useEffect(() => {
        async function load() {
            if (!iFrameBridge.block) {
                setBlockData(undefined);
                return;
            }

            const newData = await recursivelyLoadBlockDataBlockPreview({
                blockType: "PageContent",
                blockData: iFrameBridge.block,
                showOnlyVisible: iFrameBridge.showOnlyVisible,
            });

            setBlockData(newData);
        }
        load();
    }, [iFrameBridge.block, iFrameBridge.showOnlyVisible]);

    return <div>{blockData && <PageContentBlock data={blockData} />}</div>;
});
