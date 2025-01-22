import { BaseBlocksBlockItemData, BaseBlocksBlockItemInput, BlockField, createBlocksBlock } from "@comet/blocks-api";
import { AnchorBlock, DamImageBlock } from "@comet/cms-api";
import { AccordionBlock } from "@src/common/blocks/accordion.block";
import { LinkListBlock } from "@src/common/blocks/link-list.block";
import { MediaGalleryBlock } from "@src/common/blocks/media-gallery.block";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { SpaceBlock } from "@src/common/blocks/space.block";
import { StandaloneCallToActionListBlock } from "@src/common/blocks/standalone-call-to-action-list.block";
import { StandaloneHeadingBlock } from "@src/common/blocks/standalone-heading.block";
import { StandaloneMediaBlock } from "@src/common/blocks/standalone-media.block";
import { TextImageBlock } from "@src/common/blocks/text-image.block";
import { BillboardTeaserBlock } from "@src/documents/pages/blocks/billboard-teaser.block";
import { ColumnsBlock } from "@src/documents/pages/blocks/columns.block";
import { ContentGroupBlock } from "@src/documents/pages/blocks/content-group.block";
import { KeyFactsBlock } from "@src/documents/pages/blocks/key-facts.block";
import { TeaserBlock } from "@src/documents/pages/blocks/teaser.block";
import { UserGroup } from "@src/user-groups/user-group";
import { IsEnum } from "class-validator";

import { FullWidthImageBlock } from "./full-width-image.block";
import { LayoutBlock } from "./layout.block";

export const layoutBlocks = {
    accordion: AccordionBlock,
    columns: ColumnsBlock,
    contentGroup: ContentGroupBlock,
    layout: LayoutBlock,
    space: SpaceBlock,
};

export const mediaBlocks = {
    image: DamImageBlock,
    fullWidthImage: FullWidthImageBlock,
    media: StandaloneMediaBlock,
    mediaGallery: MediaGalleryBlock,
};

export const navigationBlocks = {
    anchor: AnchorBlock,
    callToActionList: StandaloneCallToActionListBlock,
    linkList: LinkListBlock,
};

export const teaserBlocks = {
    billboardTeaserBlock: BillboardTeaserBlock,
    teaser: TeaserBlock,
};

export const textAndContentBlocks = {
    heading: StandaloneHeadingBlock,
    keyFacts: KeyFactsBlock,
    richtext: RichTextBlock,
    textImage: TextImageBlock,
};

const supportedBlocks = {
    ...layoutBlocks,
    ...mediaBlocks,
    ...navigationBlocks,
    ...teaserBlocks,
    ...textAndContentBlocks,
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
