// TODO: Implement this block properly

import { BlockCategory, BlockInterface, createCompositeBlock } from "@comet/blocks-admin";
import { createRichTextBlock } from "@comet/cms-admin";
import { LinkBlock } from "@src/common/blocks/LinkBlock";
import { FormattedMessage } from "react-intl";

import { commonInputBlocks } from "./commonInputBlocks";

const RichTextBlock = createRichTextBlock({
    link: LinkBlock,
    rte: {
        maxBlocks: 1,
        supports: ["bold", "italic", "underline", "link", "links-remove", "history", "non-breaking-space", "soft-hyphen"],
        blocktypeMap: {},
    },
    minHeight: 0,
});

export const CheckboxInputBlock: BlockInterface = createCompositeBlock(
    {
        name: "CheckboxInput",
        category: BlockCategory.Form,
        displayName: <FormattedMessage id="blocks.checkboxInput" defaultMessage="Checkbox Input" />,
        blocks: {
            ...commonInputBlocks,
            text: {
                block: RichTextBlock,
                title: "Text",
            },
        },
    },
    (block) => {
        block.previewContent = (state) => [{ type: "text", content: state.label }];
        return block;
    },
);
