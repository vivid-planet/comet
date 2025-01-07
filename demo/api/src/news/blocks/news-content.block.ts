import { createBlocksBlock } from "@comet/blocks-api";
import { DamImageBlock } from "@comet/cms-api";
import { HeadingBlock } from "@src/common/blocks/heading.block";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";

export const NewsContentBlock = createBlocksBlock(
    {
        supportedBlocks: {
            headline: HeadingBlock,
            richText: RichTextBlock,
            image: DamImageBlock,
        },
    },
    { name: "NewsContent" },
);
