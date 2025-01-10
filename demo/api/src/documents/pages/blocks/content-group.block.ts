import {
    BlockData,
    BlockDataInterface,
    BlockField,
    BlockInput,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    createBlocksBlock,
    ExtractBlockInput,
    inputToData,
} from "@comet/blocks-api";
import { AnchorBlock } from "@comet/cms-api";
import { AccordionBlock } from "@src/common/blocks/accordion.block";
import { MediaGalleryBlock } from "@src/common/blocks/media-gallery.block";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { SpaceBlock } from "@src/common/blocks/space.block";
import { StandaloneCallToActionListBlock } from "@src/common/blocks/standalone-call-to-action-list.block";
import { StandaloneHeadingBlock } from "@src/common/blocks/standalone-heading.block";
import { StandaloneMediaBlock } from "@src/common/blocks/standalone-media.block";
import { ColumnsBlock } from "@src/documents/pages/blocks/columns.block";
import { KeyFactsBlock } from "@src/documents/pages/blocks/key-facts.block";
import { TeaserBlock } from "@src/documents/pages/blocks/teaser.block";
import { IsEnum } from "class-validator";

const ContentBlock = createBlocksBlock(
    {
        supportedBlocks: {
            accordion: AccordionBlock,
            anchor: AnchorBlock,
            space: SpaceBlock,
            teaser: TeaserBlock,
            richtext: RichTextBlock,
            heading: StandaloneHeadingBlock,
            columns: ColumnsBlock,
            callToActionList: StandaloneCallToActionListBlock,
            keyFacts: KeyFactsBlock,
            media: StandaloneMediaBlock,
            mediaGallery: MediaGalleryBlock,
        },
    },
    { name: "ContentGroupContent" },
);

enum BackgroundColor {
    default = "default",
    lightGray = "lightGray",
    darkGray = "darkGray",
}

class ContentGroupBlockData extends BlockData {
    @ChildBlock(ContentBlock)
    content: BlockDataInterface;

    @BlockField({ type: "enum", enum: BackgroundColor })
    backgroundColor: BackgroundColor;
}

class ContentGroupBlockInput extends BlockInput {
    @ChildBlockInput(ContentBlock)
    content: ExtractBlockInput<typeof ContentBlock>;

    @IsEnum(BackgroundColor)
    @BlockField({ type: "enum", enum: BackgroundColor })
    backgroundColor: BackgroundColor;

    transformToBlockData(): ContentGroupBlockData {
        return inputToData(ContentGroupBlockData, this);
    }
}

export const ContentGroupBlock = createBlock(ContentGroupBlockData, ContentGroupBlockInput, "ContentGroup");
