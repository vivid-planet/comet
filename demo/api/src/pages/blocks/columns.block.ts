import { ColumnsBlockFactory, createBlocksBlock, SpaceBlock } from "@comet/blocks-api";
import { AnchorBlock, DamImageBlock } from "@comet/cms-api";
import { AccordionBlock } from "@src/common/blocks/accordion.block";
import { LinkListBlock } from "@src/common/blocks/link-list.block";
import { MediaGalleryBlock } from "@src/common/blocks/media-gallery.block";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { StandaloneCallToActionListBlock } from "@src/common/blocks/standalone-call-to-action-list.block";
import { StandaloneHeadingBlock } from "@src/common/blocks/standalone-heading.block";
import { StandaloneMediaBlock } from "@src/common/blocks/standalone-media.block";

import { HeadlineBlock } from "./headline.block";

const ColumnsContentBlock = createBlocksBlock(
    {
        supportedBlocks: {
            accordion: AccordionBlock,
            anchor: AnchorBlock,
            callToActionList: StandaloneCallToActionListBlock,
            heading: StandaloneHeadingBlock,
            headline: HeadlineBlock,
            image: DamImageBlock,
            linkList: LinkListBlock,
            media: StandaloneMediaBlock,
            mediaGallery: MediaGalleryBlock,
            richtext: RichTextBlock,
            space: SpaceBlock,
        },
    },
    "ColumnsContent",
);

const ColumnsBlock = ColumnsBlockFactory.create(
    {
        contentBlock: ColumnsContentBlock,
        layouts: [
            { name: "2-20-2" },
            { name: "4-16-4" },
            { name: "9-6-9" },
            { name: "9-9" },
            { name: "12-6" },
            { name: "6-12" },
            { name: "one-column" },
            { name: "two-columns" },
            { name: "two-columns-12-6" },
        ],
    },
    "Columns",
);

export { ColumnsBlock };
