"use client";

import { useIFrameBridge } from "@comet/site-nextjs";
import { type FooterContentBlockData } from "@src/blocks.generated";
import { FooterContentBlock } from "@src/layout/footer/blocks/FooterContentBlock";
import { withBlockPreview } from "@src/util/blockPreview";
import { recursivelyLoadBlockDataBlockPreview } from "@src/util/recursivelyLoadBlockData";
import { useEffect, useState } from "react";

export default withBlockPreview(() => {
    const iFrameBridge = useIFrameBridge();

    const [blockData, setBlockData] = useState<FooterContentBlockData>();
    useEffect(() => {
        async function load() {
            if (!iFrameBridge.block) {
                setBlockData(undefined);
                return;
            }
            const newData = await recursivelyLoadBlockDataBlockPreview({
                blockType: "FooterContent",
                blockData: iFrameBridge.block,
                showOnlyVisible: iFrameBridge.showOnlyVisible,
            });
            setBlockData(newData);
        }
        load();
    }, [iFrameBridge.block, iFrameBridge.showOnlyVisible]);

    return <div>{blockData && <FooterContentBlock data={blockData} />}</div>;
});
