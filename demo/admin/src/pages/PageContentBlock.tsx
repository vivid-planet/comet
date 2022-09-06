import { createBlocksBlock, Space as SpaceBlock, YouTubeVideoBlock } from "@comet/blocks-admin";
import { DamImageBlock, DamVideoBlock } from "@comet/cms-admin";
import { LinkListBlock } from "@src/common/blocks/LinkListBlock";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";

import { ColumnsBlock } from "./blocks/ColumnsBlock";
import { FullWidthImageBlock } from "./blocks/FullWidthImageBlock";
import { HeadlineBlock } from "./blocks/HeadlineBlock";
import { TextImageBlock } from "./blocks/TextImageBlock";

export const PageContentBlock = createBlocksBlock({
    name: "PageContent",
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
});
