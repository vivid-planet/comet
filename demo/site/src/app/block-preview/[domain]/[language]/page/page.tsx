"use client";

<<<<<<< HEAD
import { useBlockPreviewFetch, useIFrameBridge } from "@comet/cms-site";
import { type PageContentBlockData } from "@src/blocks.generated";
=======
import { useBlockPreviewFetch, useIFrameBridge } from "@comet/site-nextjs";
import { PageContentBlockData } from "@src/blocks.generated";
>>>>>>> main
import { PageContentBlock } from "@src/documents/pages/blocks/PageContentBlock";
import { withBlockPreview } from "@src/util/blockPreview";
import { recursivelyLoadBlockData } from "@src/util/recursivelyLoadBlockData";
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
