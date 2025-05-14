"use client";

import { useIFrameBridge } from "@comet/site-next";
import { StageBlock } from "@src/documents/pages/blocks/StageBlock";
import { withBlockPreview } from "@src/util/blockPreview";

export default withBlockPreview(() => {
    const { block: stage } = useIFrameBridge();
    return stage ? <StageBlock data={stage} /> : null;
});
