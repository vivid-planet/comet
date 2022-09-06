import { createBlocksBlock, SpaceBlock, YouTubeVideoBlock } from "@comet/blocks-api";
import { DamImageBlock, DamVideoBlock } from "@comet/cms-api";
import { LinkListBlock } from "@src/common/blocks/link-list.block";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";

import { ColumnsBlock } from "./columns.block";
import { FullWidthImageBlock } from "./full-width-image.block";
import { HeadlineBlock } from "./headline.block";
import { TextImageBlock } from "./TextImageBlock";

export const PageContentBlock = createBlocksBlock(
    {
        supportedBlocks: {
            space: SpaceBlock,
            richtext: RichTextBlock,
            headline: HeadlineBlock,
            image: DamImageBlock,
            textImage: TextImageBlock,
            damVideo: DamVideoBlock,
            youTubeVideo: YouTubeVideoBlock,
            linkList: LinkListBlock,
            fullWidthImage: FullWidthImageBlock,
            columns: ColumnsBlock,
        },
    },
    "PageContent",
);
