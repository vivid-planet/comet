import { BlockCategory, createCompositeBlock, createOptionalBlock } from "@comet/blocks-admin";
import { DamImageBlock } from "@comet/cms-admin";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import * as React from "react";
import { FormattedMessage } from "react-intl";

const FullWidthImageContentBlock = createOptionalBlock(RichTextBlock, {
    title: <FormattedMessage id="cometDemo.generic.content" defaultMessage="Content" />,
});

export const FullWidthImageBlock = createCompositeBlock(
    {
        name: "FullWidthImage",
        displayName: <FormattedMessage id="cometDemo.blocks.fullWidthImage" defaultMessage="Full Width Image" />,
        category: BlockCategory.Media,
        blocks: {
            image: {
                block: DamImageBlock,
                title: <FormattedMessage id="cometDemo.generic.image" defaultMessage="Image" />,
                paper: true,
            },
            content: {
                block: FullWidthImageContentBlock,
                title: <FormattedMessage id="cometDemo.generic.content" defaultMessage="Content" />,
            },
        },
    },
    (block) => ({
        ...block,
        extractTextContents: (block) => {
            const content = block.content?.block ? RichTextBlock.extractTextContents?.(block.content?.block ?? {}) ?? [] : [];
            return content;
        },
        replaceTextContents: (state, contents) => ({
            ...state,
            content: {
                ...state.content,
                block: state.content.block
                    ? RichTextBlock.replaceTextContents?.(state.content.block, contents) ?? state.content.block
                    : state.content.block,
            },
        }),
    }),
);
