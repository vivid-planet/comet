import { ColumnsBlockFactory, createBlocksBlock } from "@comet/blocks-api";
import { AnchorBlock } from "@comet/cms-api";
import { AccordionBlock } from "@src/common/blocks/accordion.block";
import { MediaGalleryListBlock } from "@src/common/blocks/media-gallery.block";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { SpaceBlock } from "@src/common/blocks/space.block";
import { StandaloneCallToActionListBlock } from "@src/common/blocks/standalone-call-to-action-list.block";
import { StandaloneHeadingBlock } from "@src/common/blocks/standalone-heading.block";
import { StandaloneMediaBlock } from "@src/common/blocks/standalone-media.block";

export const supportedBlocks = {
    accordion: AccordionBlock,
    anchor: AnchorBlock,
    richtext: RichTextBlock,
    space: SpaceBlock,
    heading: StandaloneHeadingBlock,
    callToActionList: StandaloneCallToActionListBlock,
    media: StandaloneMediaBlock,
    mediaGallery: MediaGalleryListBlock,
};

export const ColumnsContentBlock = createBlocksBlock({ supportedBlocks }, { name: "ColumnsContent" });

export const ColumnsBlock = ColumnsBlockFactory.create(
    {
        layouts: [{ name: "2-20-2" }, { name: "4-16-4" }, { name: "9-6-9" }, { name: "9-9" }, { name: "12-6" }, { name: "6-12" }],
        contentBlock: ColumnsContentBlock,
    },
    "Columns",
);
