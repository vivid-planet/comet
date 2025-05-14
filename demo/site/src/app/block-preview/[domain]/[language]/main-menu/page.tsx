"use client";
import { useIFrameBridge } from "@comet/site-next";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import { withBlockPreview } from "@src/util/blockPreview";

export default withBlockPreview(() => {
    const { block } = useIFrameBridge();
    return block ? <RichTextBlock data={block} /> : null;
});
