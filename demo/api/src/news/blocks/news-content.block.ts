import { createBlocksBlock } from "@comet/blocks-api";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { HeadlineBlock } from "@src/pages/blocks/headline.block";
import { ImageBlock } from "@src/pages/blocks/ImageBlock";
import { TextImageBlock } from "@src/pages/blocks/TextImageBlock";

export const NewsContentBlock = createBlocksBlock(
    {
        supportedBlocks: {
            heading: HeadlineBlock,
            richtext: RichTextBlock,
            image: ImageBlock,
            textImage: TextImageBlock,
        },
    },
    { name: "NewsContent" },
);
