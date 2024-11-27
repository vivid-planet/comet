import { createRichTextBlock } from "@comet/cms-admin";
import { LinkBlock } from "@src/common/blocks/LinkBlock";

export const InputRichTextBlock = createRichTextBlock({
    link: LinkBlock,
    rte: {
        maxBlocks: 1,
        supports: ["bold", "italic", "underline", "link", "links-remove", "history", "non-breaking-space", "soft-hyphen"],
        blocktypeMap: {},
    },
    minHeight: 0,
});
