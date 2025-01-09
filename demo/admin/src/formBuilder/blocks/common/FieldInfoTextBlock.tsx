import { createRichTextBlock } from "@comet/cms-admin";
import { LinkBlock } from "@src/common/blocks/LinkBlock";

export const FieldInfoTextBlock = createRichTextBlock({
    link: LinkBlock,
    rte: {
        maxBlocks: 1,
        supports: ["bold", "italic", "sub", "sup", "non-breaking-space", "soft-hyphen"],
    },
    // @ts-expect-error Will be fixed with https://vivid-planet.atlassian.net/browse/COM-1522
    minHeight: "40px",
});
