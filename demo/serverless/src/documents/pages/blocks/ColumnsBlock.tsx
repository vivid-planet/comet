import {
    AnchorBlock,
    ColumnsLayoutPreview,
    ColumnsLayoutPreviewContent,
    ColumnsLayoutPreviewSpacing,
    createBlocksBlock,
    createColumnsBlock,
} from "@dextinity/cms-admin";
import { FormattedMessage } from "react-intl";

import { AccordionBlock } from "../../../common/blocks/AccordionBlock";
import { MediaGalleryBlock } from "../../../common/blocks/MediaGalleryBlock";
import { SpaceBlock } from "../../../common/blocks/SpaceBlock";
import { StandaloneCallToActionListBlock } from "../../../common/blocks/StandaloneCallToActionListBlock";
import { StandaloneHeadingBlock } from "../../../common/blocks/StandaloneHeadingBlock";
import { StandaloneMediaBlock } from "../../../common/blocks/StandaloneMediaBlock";
import { StandaloneRichTextBlock } from "../../../common/blocks/StandaloneRichTextBlock";
import { TextImageBlock } from "../../../common/blocks/TextImageBlock";

const oneColumnLayouts = [
    {
        name: "2-20-2",
        columns: 1,
        label: <FormattedMessage id="columnsBlock.center.large" defaultMessage="Center large" />,
        preview: (
            <ColumnsLayoutPreview>
                <ColumnsLayoutPreviewSpacing width={2} />
                <ColumnsLayoutPreviewContent width={20} />
                <ColumnsLayoutPreviewSpacing width={2} />
            </ColumnsLayoutPreview>
        ),
    },
    {
        name: "4-16-4",
        columns: 1,
        label: <FormattedMessage id="columnsBlock.center.medium" defaultMessage="Center medium" />,
        preview: (
            <ColumnsLayoutPreview>
                <ColumnsLayoutPreviewSpacing width={4} />
                <ColumnsLayoutPreviewContent width={16} />
                <ColumnsLayoutPreviewSpacing width={4} />
            </ColumnsLayoutPreview>
        ),
    },
    {
        name: "6-12-6",
        columns: 1,
        label: <FormattedMessage id="columnsBlock.center.small" defaultMessage="Center small" />,
        preview: (
            <ColumnsLayoutPreview>
                <ColumnsLayoutPreviewSpacing width={6} />
                <ColumnsLayoutPreviewContent width={12} />
                <ColumnsLayoutPreviewSpacing width={6} />
            </ColumnsLayoutPreview>
        ),
    },
];

const twoColumnLayouts = [
    {
        name: "9-9",
        columns: 2,
        label: <FormattedMessage id="columnsBlock.sameWidth.normal" defaultMessage="Same width" />,
        preview: (
            <ColumnsLayoutPreview>
                <ColumnsLayoutPreviewSpacing width={2} />
                <ColumnsLayoutPreviewContent width={9} />
                <ColumnsLayoutPreviewSpacing width={2} />
                <ColumnsLayoutPreviewContent width={9} />
                <ColumnsLayoutPreviewSpacing width={2} />
            </ColumnsLayoutPreview>
        ),
        section: {
            name: "sameWidth",
            label: <FormattedMessage id="columnsBlock.sameWidth" defaultMessage="Same width" />,
        },
    },
    {
        name: "12-6",
        columns: 2,
        label: <FormattedMessage id="columnsBlock.weightedLeft" defaultMessage="Weighted left" />,
        preview: (
            <ColumnsLayoutPreview>
                <ColumnsLayoutPreviewSpacing width={2} />
                <ColumnsLayoutPreviewContent width={12} />
                <ColumnsLayoutPreviewSpacing width={2} />
                <ColumnsLayoutPreviewContent width={6} />
                <ColumnsLayoutPreviewSpacing width={2} />
            </ColumnsLayoutPreview>
        ),
        section: {
            name: "differentWidth",
            label: <FormattedMessage id="columnsBlock.differentWidth" defaultMessage="Different width" />,
        },
    },
    {
        name: "6-12",
        columns: 2,
        label: <FormattedMessage id="columnsBlock.weightedRight" defaultMessage="Weighted right" />,
        preview: (
            <ColumnsLayoutPreview>
                <ColumnsLayoutPreviewSpacing width={2} />
                <ColumnsLayoutPreviewContent width={6} />
                <ColumnsLayoutPreviewSpacing width={2} />
                <ColumnsLayoutPreviewContent width={12} />
                <ColumnsLayoutPreviewSpacing width={2} />
            </ColumnsLayoutPreview>
        ),
        section: {
            name: "differentWidth",
            label: <FormattedMessage id="columnsBlock.differentWidth" defaultMessage="Different width" />,
        },
    },
];

const ColumnsContentBlock = createBlocksBlock({
    name: "ColumnsContent",
    supportedBlocks: {
        accordion: AccordionBlock,
        anchor: AnchorBlock,
        richtext: StandaloneRichTextBlock,
        space: SpaceBlock,
        heading: StandaloneHeadingBlock,
        callToActionList: StandaloneCallToActionListBlock,
        media: StandaloneMediaBlock,
        mediaGallery: MediaGalleryBlock,
        textImage: TextImageBlock,
    },
});

export const ColumnsBlock = createColumnsBlock({
    name: "Columns",
    displayName: <FormattedMessage id="columnsBlock.displayName" defaultMessage="Columns" />,
    contentBlock: ColumnsContentBlock,
    layouts: [...oneColumnLayouts, ...twoColumnLayouts],
});
