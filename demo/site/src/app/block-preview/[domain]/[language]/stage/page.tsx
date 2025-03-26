"use client";

import { useIFrameBridge } from "@comet/cms-site";
import { StageBlock } from "@src/documents/pages/blocks/StageBlock";
import { withBlockPreview } from "@src/util/blockPreview";

export default withBlockPreview(() => {
    const { block: stage } = useIFrameBridge();
    return stage ? <StageBlock data={stage} /> : null;
});
