import {
    ColumnsLayoutPreview,
    ColumnsLayoutPreviewContent,
    ColumnsLayoutPreviewSpacing,
    createBlocksBlock,
    createColumnsBlock,
    SpaceBlock,
} from "@comet/blocks-admin";
import { DamImageBlock } from "@comet/cms-admin";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import * as React from "react";

import { HeadlineBlock } from "./HeadlineBlock";

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
        },
    ],
    contentBlock: ColumnsContentBlock,
});

export { ColumnsBlock };
