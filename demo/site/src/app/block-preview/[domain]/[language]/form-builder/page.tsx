"use client";

import { useBlockPreviewFetch, useIFrameBridge } from "@comet/cms-site";
import { FormBuilderBlockData } from "@src/blocks.generated";
import { FormBuilderBlock } from "@src/form-builder/blocks/FormBuilderBlock";
import { recursivelyLoadBlockData } from "@src/recursivelyLoadBlockData";
import { withBlockPreview } from "@src/util/blockPreview";
import { useEffect, useState } from "react";

export default withBlockPreview(() => {
    const iFrameBridge = useIFrameBridge();
    const { fetch, graphQLFetch } = useBlockPreviewFetch();
    const [blockData, setBlockData] = useState<FormBuilderBlockData>();

    useEffect(() => {
        async function load() {
            if (!graphQLFetch) return;
            if (!iFrameBridge.block) {
                setBlockData(undefined);
                return;
            }
            const newData = await recursivelyLoadBlockData({
                blockType: "FormBuilder",
                blockData: iFrameBridge.block,
                graphQLFetch,
                fetch,
            });
            setBlockData(newData);
        }
        load();
    }, [iFrameBridge.block, fetch, graphQLFetch]);

    return (
        <div>
            {blockData && <FormBuilderBlock data={blockData} submitButtonText={iFrameBridge.block.submitButtonText} formId={iFrameBridge.block.id} />}
        </div>
    );
});
