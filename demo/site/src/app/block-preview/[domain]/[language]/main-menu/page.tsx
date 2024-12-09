"use client";
import { useIFrameBridge } from "@comet/cms-site";
import { RichTextBlock } from "@src/blocks/RichTextBlock";
import { withBlockPreview } from "@src/util/blockPreview";

export default withBlockPreview(() => {
    const { block } = useIFrameBridge();
    return block ? <RichTextBlock data={block} /> : null;
});
