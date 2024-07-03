import {
    ColumnsLayoutPreview,
    ColumnsLayoutPreviewContent,
    ColumnsLayoutPreviewSpacing,
    createBlocksBlock,
    createColumnsBlock,
    SpaceBlock,
} from "@comet/blocks-admin";
import { DamImageBlock } from "@comet/cms-admin";
import { HeadlineBlock } from "@src/common/blocks/HeadlineBlock";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import * as React from "react";
import { FormattedMessage } from "react-intl";

const ColumnsContentBlock = createBlocksBlock({
    name: "ColumnsContent",
    supportedBlocks: {
        space: SpaceBlock,
        richtext: RichTextBlock,
        headline: HeadlineBlock,
        image: DamImageBlock,
    },
});

const ColumnsBlock = createColumnsBlock({
    name: "Columns",
    displayName: "Columns",
    layouts: [
        {
            name: "one-column",
            label: "One column",
            columns: 1,
            preview: (
                <ColumnsLayoutPreview>
                    <ColumnsLayoutPreviewSpacing width={2} />
                    <ColumnsLayoutPreviewContent width={20} />
                    <ColumnsLayoutPreviewSpacing width={2} />
                </ColumnsLayoutPreview>
            ),
        },
        {
            name: "two-columns",
            label: "Two columns",
            columns: 2,
            preview: (
                <ColumnsLayoutPreview>
                    <ColumnsLayoutPreviewContent width={10} />
                    <ColumnsLayoutPreviewSpacing width={4} />
                    <ColumnsLayoutPreviewContent width={10} />
                </ColumnsLayoutPreview>
            ),
            section: {
                name: "same-width",
                label: <FormattedMessage id="columnsBlock.layouts.twoColumns.section.sameWidth" defaultMessage="Same width" />,
            },
        },
        {
            name: "two-columns-12-6",
            label: "Two columns 12-6",
            columns: 2,
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
                name: "different-width",
                label: <FormattedMessage id="columnsBlock.layouts.twoColumns.section.differentWidth" defaultMessage="Different width" />,
            },
        },
    ],
    contentBlock: ColumnsContentBlock,
});

export { ColumnsBlock };
