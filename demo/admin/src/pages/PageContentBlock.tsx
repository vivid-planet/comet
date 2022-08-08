import { createBlocksBlock, Space as SpaceBlock, YouTubeVideoBlock } from "@comet/blocks-admin";
import { DamImageBlock, DamVideoBlock } from "@comet/cms-admin";
import { ImageBlock } from "@src/common/blocks/ImageBlock";
import { LinkListBlock } from "@src/common/blocks/LinkListBlock";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";

import { FullWidthImageBlock } from "./blocks/FullWidthImageBlock";
import { HeadlineBlock } from "./blocks/HeadlineBlock";
import { TextImageBlock } from "./blocks/TextImageBlock";

export const PageContentBlock = createBlocksBlock({
    name: "PageContent",
    supportedBlocks: {
        space: SpaceBlock,
        richtext: RichTextBlock,
        headline: HeadlineBlock,
        image: ImageBlock,
        textImage: TextImageBlock,
        damImage: DamImageBlock,
        damVideo: DamVideoBlock,
        youTubeVideo: YouTubeVideoBlock,
        linkList: LinkListBlock,
        fullWidthImage: FullWidthImageBlock,
    },
});
