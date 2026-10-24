import { AnchorBlock, BlockCategory, createBlocksBlock, createCompositeBlock, createCompositeBlockSelectField } from "@dextinity/cms-admin";
import type { ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { AccordionBlock } from "../../../common/blocks/AccordionBlock";
import { MediaGalleryBlock } from "../../../common/blocks/MediaGalleryBlock";
import { SpaceBlock } from "../../../common/blocks/SpaceBlock";
import { StandaloneCallToActionListBlock } from "../../../common/blocks/StandaloneCallToActionListBlock";
import { StandaloneHeadingBlock } from "../../../common/blocks/StandaloneHeadingBlock";
import { StandaloneMediaBlock } from "../../../common/blocks/StandaloneMediaBlock";
import { StandaloneRichTextBlock } from "../../../common/blocks/StandaloneRichTextBlock";
import { TableBlock } from "../../../common/blocks/TableBlock";
import { ColumnsBlock } from "./ColumnsBlock";
import { KeyFactsBlock } from "./KeyFactsBlock";
import { TeaserBlock } from "./TeaserBlock";

const backgroundColorOptions: Array<{ value: "default" | "lightGray" | "darkGray"; label: ReactNode }> = [
    { value: "default", label: <FormattedMessage id="contentGroupBlock.backgroundColor.default" defaultMessage="Default" /> },
    { value: "lightGray", label: <FormattedMessage id="contentGroupBlock.backgroundColor.lightGray" defaultMessage="Light Gray" /> },
    { value: "darkGray", label: <FormattedMessage id="contentGroupBlock.backgroundColor.darkGray" defaultMessage="Dark Gray" /> },
];

const ContentGroupContentBlock = createBlocksBlock({
    name: "ContentGroupContent",
    supportedBlocks: {
        accordion: AccordionBlock,
        anchor: AnchorBlock,
        space: SpaceBlock,
        teaser: TeaserBlock,
        richtext: StandaloneRichTextBlock,
        heading: StandaloneHeadingBlock,
        columns: ColumnsBlock,
        callToActionList: StandaloneCallToActionListBlock,
        keyFacts: KeyFactsBlock,
        media: StandaloneMediaBlock,
        mediaGallery: MediaGalleryBlock,
        table: TableBlock,
    },
});

export const ContentGroupBlock = createCompositeBlock(
    {
        name: "ContentGroup",
        displayName: <FormattedMessage id="contentGroupBlock.displayName" defaultMessage="Content Group" />,
        blocks: {
            backgroundColor: {
                block: createCompositeBlockSelectField({
                    label: <FormattedMessage id="contentGroupBlock.overlay" defaultMessage="Background Color" />,
                    defaultValue: "default",
                    options: backgroundColorOptions,
                    required: true,
                }),
                hiddenInSubroute: true,
            },
            content: {
                block: ContentGroupContentBlock,
                title: <FormattedMessage id="contentGroupBlock.content" defaultMessage="Content" />,
            },
        },
    },
    (block) => {
        block.category = BlockCategory.Layout;
        return block;
    },
);
