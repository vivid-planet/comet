import { BaseBlocksBlockItemData, BaseBlocksBlockItemInput, BlockField, createBlocksBlock } from "@comet/blocks-api";
import { AnchorBlock, DamImageBlock } from "@comet/cms-api";
import { AccordionBlock } from "@src/common/blocks/accordion.block";
import { LinkListBlock } from "@src/common/blocks/link-list.block";
import { MediaGalleryBlock } from "@src/common/blocks/media-gallery.block";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { SpaceBlock } from "@src/common/blocks/space.block";
import { StandaloneMediaBlock } from "@src/common/blocks/standalone-media.block";
import { NewsDetailBlock } from "@src/news/blocks/news-detail.block";
import { NewsListBlock } from "@src/news/blocks/news-list.block";
import { LayoutBlock } from "@src/pages/blocks/layout.block";
import { UserGroup } from "@src/user-groups/user-group";
import { IsEnum } from "class-validator";

import { ColumnsBlock } from "./columns.block";
import { FullWidthImageBlock } from "./full-width-image.block";
import { HeadlineBlock } from "./headline.block";
import { ImageLinkBlock } from "./image-link.block";
import { TeaserBlock } from "./teaser.block";
import { TextImageBlock } from "./TextImageBlock";
import { TwoListsBlock } from "./two-lists.block";

const supportedBlocks = {
    space: SpaceBlock,
    richtext: RichTextBlock,
    headline: HeadlineBlock,
    image: DamImageBlock,
    textImage: TextImageBlock,
    linkList: LinkListBlock,
    fullWidthImage: FullWidthImageBlock,
    columns: ColumnsBlock,
    anchor: AnchorBlock,
    twoLists: TwoListsBlock,
    media: StandaloneMediaBlock,
    teaser: TeaserBlock,
    newsDetail: NewsDetailBlock,
    imageLink: ImageLinkBlock,
    newsList: NewsListBlock,
    layout: LayoutBlock,
    accordion: AccordionBlock,
    mediaGallery: MediaGalleryBlock,
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
