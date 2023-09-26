import { createBlocksBlock } from "@comet/blocks-admin";
import { DamImageBlock } from "@comet/cms-admin";
import { HeadlineBlock } from "@src/common/blocks/HeadlineBlock";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import { TextImageBlock } from "@src/common/blocks/TextImageBlock";

export const NewsContentBlock = createBlocksBlock({
    name: "NewsContentBlock",
    supportedBlocks: {
        heading: HeadlineBlock,
        richtext: RichTextBlock,
        image: DamImageBlock,
        textImage: TextImageBlock,
    },
});
