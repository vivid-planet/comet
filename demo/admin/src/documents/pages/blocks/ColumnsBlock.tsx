import {
    ColumnsLayoutPreview,
    ColumnsLayoutPreviewContent,
    ColumnsLayoutPreviewSpacing,
    createBlocksBlock,
    createColumnsBlock,
} from "@comet/blocks-admin";
import { AnchorBlock } from "@comet/cms-admin";
import { AccordionBlock } from "@src/common/blocks/AccordionBlock";
import { MediaGalleryBlock } from "@src/common/blocks/MediaGalleryBlock";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import { SpaceBlock } from "@src/common/blocks/SpaceBlock";
import { StandaloneCallToActionListBlock } from "@src/common/blocks/StandaloneCallToActionListBlock";
import { StandaloneHeadingBlock } from "@src/common/blocks/StandaloneHeadingBlock";
import { StandaloneMediaBlock } from "@src/common/blocks/StandaloneMediaBlock";
import { FormattedMessage } from "react-intl";

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
        name: "9-6-9",
        columns: 1,
        label: <FormattedMessage id="columnsBlock.center.small" defaultMessage="Center small" />,
        preview: (
            <ColumnsLayoutPreview>
                <ColumnsLayoutPreviewSpacing width={9} />
                <ColumnsLayoutPreviewContent width={6} />
                <ColumnsLayoutPreviewSpacing width={9} />
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
        richtext: RichTextBlock,
        space: SpaceBlock,
        heading: StandaloneHeadingBlock,
        callToActionList: StandaloneCallToActionListBlock,
        media: StandaloneMediaBlock,
        mediaGallery: MediaGalleryBlock,
    },
});

export const ColumnsBlock = createColumnsBlock({
    name: "Columns",
    displayName: <FormattedMessage id="columnsBlock.displayName" defaultMessage="Columns" />,
    contentBlock: ColumnsContentBlock,
    layouts: [...oneColumnLayouts, ...twoColumnLayouts],
});
