import { BaseBlocksBlockItemData, BaseBlocksBlockItemInput, BlockField, createBlocksBlock } from "@comet/blocks-api";
import { AnchorBlock, DamImageBlock } from "@comet/cms-api";
import { HeadingBlock } from "@src/common/blocks/heading.block";
import { LinkListBlock } from "@src/common/blocks/link-list.block";
import { MediaBlock } from "@src/common/blocks/media.block";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { SpaceBlock } from "@src/common/blocks/space.block";
import { NewsDetailBlock } from "@src/news/blocks/news-detail.block";
import { NewsListBlock } from "@src/news/blocks/news-list.block";
import { UserGroup } from "@src/user-groups/user-group";
import { IsEnum } from "class-validator";

import { BillboardTeaserBlock } from "./billboard-teaser.block";
import { ColumnsBlock } from "./columns.block";
import { ContentGroupBlock } from "./content-group.block";
import { FullWidthImageBlock } from "./full-width-image.block";
import { ImageLinkBlock } from "./image-link.block";
import { LayoutBlock } from "./layout.block";
import { TeaserBlock } from "./teaser.block";
import { TextImageBlock } from "./TextImageBlock";

const supportedBlocks = {
    anchor: AnchorBlock,
    billboardTeaser: BillboardTeaserBlock,
    columns: ColumnsBlock,
    contentGroup: ContentGroupBlock,
    fullWidthImage: FullWidthImageBlock,
    heading: HeadingBlock,
    image: DamImageBlock,
    imageLink: ImageLinkBlock,
    layout: LayoutBlock,
    linkList: LinkListBlock,
    media: MediaBlock,
    newsDetail: NewsDetailBlock,
    newsList: NewsListBlock,
    richText: RichTextBlock,
    space: SpaceBlock,
    teaser: TeaserBlock,
    textImage: TextImageBlock,
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
