import { createBlocksBlock } from "@comet/blocks-api";
import { DamImageBlock } from "@comet/cms-api";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { HeadlineBlock } from "@src/pages/blocks/headline.block";
import { TextImageBlock } from "@src/pages/blocks/TextImageBlock";

export const NewsContentBlock = createBlocksBlock(
    {
        supportedBlocks: {
            headline: HeadlineBlock,
            richtext: RichTextBlock,
            image: DamImageBlock,
            textImage: TextImageBlock,
        },
    },
    { name: "NewsContent" },
);
