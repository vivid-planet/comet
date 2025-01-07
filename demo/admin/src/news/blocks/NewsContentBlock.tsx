import { createBlocksBlock } from "@comet/blocks-admin";
import { DamImageBlock } from "@comet/cms-admin";
import { HeadingBlock } from "@src/common/blocks/HeadingBlock";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";

export const NewsContentBlock = createBlocksBlock({
    name: "NewsContentBlock",
    supportedBlocks: {
        heading: HeadingBlock,
        richText: RichTextBlock,
        image: DamImageBlock,
    },
});
