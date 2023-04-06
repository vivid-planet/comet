import { messages } from "@comet/admin";
import { BlockCategory, createCompositeBlock, createOptionalBlock } from "@comet/blocks-admin";
import { DamImageBlock } from "@comet/cms-admin";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import * as React from "react";
import { FormattedMessage } from "react-intl";

const FullWidthImageContentBlock = createOptionalBlock(RichTextBlock, {
    title: <FormattedMessage {...messages.content} />,
});

export const FullWidthImageBlock = createCompositeBlock(
    {
        name: "FullWidthImage",
        displayName: <FormattedMessage id="blocks.fullWidthImage" defaultMessage="Full Width Image" />,
        category: BlockCategory.Media,
        blocks: {
            image: {
                block: DamImageBlock,
                title: <FormattedMessage {...messages.image} />,
                paper: true,
            },
            content: {
                block: FullWidthImageContentBlock,
                title: <FormattedMessage {...messages.content} />,
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
