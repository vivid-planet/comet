"use client";

<<<<<<< HEAD
import { useBlockPreviewFetch, useIFrameBridge } from "@comet/cms-site";
import { type FooterContentBlockData } from "@src/blocks.generated";
=======
import { useBlockPreviewFetch, useIFrameBridge } from "@comet/site-nextjs";
import { FooterContentBlockData } from "@src/blocks.generated";
>>>>>>> main
import { FooterContentBlock } from "@src/layout/footer/blocks/FooterContentBlock";
import { withBlockPreview } from "@src/util/blockPreview";
import { recursivelyLoadBlockData } from "@src/util/recursivelyLoadBlockData";
import { useEffect, useState } from "react";

export default withBlockPreview(() => {
    const iFrameBridge = useIFrameBridge();

    const { fetch, graphQLFetch } = useBlockPreviewFetch();

    const [blockData, setBlockData] = useState<FooterContentBlockData>();
    useEffect(() => {
        async function load() {
            if (!graphQLFetch) return;
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
});
