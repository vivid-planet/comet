import { BaseBlocksBlockItemData, BaseBlocksBlockItemInput, BlockField, createBlocksBlock, SpaceBlock, YouTubeVideoBlock } from "@comet/blocks-api";
import { AnchorBlock, DamImageBlock, DamVideoBlock } from "@comet/cms-api";
import { LinkListBlock } from "@src/common/blocks/link-list.block";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { UserGroup } from "@src/user-groups/user-group";
import { IsEnum } from "class-validator";

import { ColumnsBlock } from "./columns.block";
import { FullWidthImageBlock } from "./full-width-image.block";
import { HeadlineBlock } from "./headline.block";
import { MediaBlock } from "./media.block";
import { TeaserBlock } from "./teaser.block";
import { TextImageBlock } from "./TextImageBlock";
import { TwoListsBlock } from "./two-lists.block";
import { VideoBlock } from "./video.block";

const supportedBlocks = {
    space: SpaceBlock,
    richtext: RichTextBlock,
    headline: HeadlineBlock,
    image: DamImageBlock,
    textImage: TextImageBlock,
    damVideo: DamVideoBlock,
    youTubeVideo: YouTubeVideoBlock,
    video: VideoBlock,
    linkList: LinkListBlock,
    fullWidthImage: FullWidthImageBlock,
    columns: ColumnsBlock,
    anchor: AnchorBlock,
    twoLists: TwoListsBlock,
    media: MediaBlock,
    teaser: TeaserBlock,
};

class BlocksBlockItemData extends BaseBlocksBlockItemData(supportedBlocks) {
    @BlockField({ type: "enum", enum: UserGroup })
    userGroup: UserGroup;
}

class BlocksBlockItemInput extends BaseBlocksBlockItemInput(supportedBlocks, BlocksBlockItemData) {
    @BlockField({ type: "enum", enum: UserGroup })
    @IsEnum(UserGroup)
    userGroup: UserGroup;
}

export const PageContentBlock = createBlocksBlock(
    {
        supportedBlocks,
        BlocksBlockItemData,
        BlocksBlockItemInput,
    },
    "PageContent",
);
