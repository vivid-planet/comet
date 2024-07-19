import { BlockCategory, createCompositeBlock, createCompositeBlockTextField } from "@comet/blocks-admin";
import { DamImageBlock } from "@comet/cms-admin";
import React from "react";
import { FormattedMessage } from "react-intl";

import { RichTextBlock } from "./RichTextBlock";

export const HighlightTeaserBlock = createCompositeBlock({
    name: "HighlightTeaser",
    displayName: <FormattedMessage id="highlightTeaser.displayName" defaultMessage="Highlight Teaser" />,
    category: BlockCategory.TextAndContent,
    blocks: {
        title: {
            block: createCompositeBlockTextField({
                fieldProps: { label: <FormattedMessage id="highlightTeaser.title" defaultMessage="Title" />, fullWidth: true },
            }),
        },
        description: {
            block: RichTextBlock,
            title: <FormattedMessage id="highlightTeaser.description" defaultMessage="Description" />,
        },
        image: {
            block: DamImageBlock,
            title: <FormattedMessage id="highlightTeaser.image" defaultMessage="Image" />,
        },
    },
});
