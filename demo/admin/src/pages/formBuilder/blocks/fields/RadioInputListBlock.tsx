// TODO: Implement this block properly

import { BlockCategory, BlockInterface, createCompositeBlock, createCompositeBlockTextField, createListBlock } from "@comet/blocks-admin";
import { FormattedMessage } from "react-intl";

import { commonInputBlocks } from "./commonInputBlocks";
import { InputRichTextBlock } from "./InputRichTextBlock";

const RadioInputItemBlock: BlockInterface = createCompositeBlock({
    name: "RadioInputItem",
    displayName: "Radio Input Item",
    blocks: {
        name: {
            block: createCompositeBlockTextField({
                fieldProps: { fullWidth: true, label: <FormattedMessage id="blocks.formBuilderInput.name" defaultMessage="Name" /> },
            }),
        },
        text: {
            block: InputRichTextBlock,
            title: "Text",
        },
    },
});

const RadioInputItemListBlock = createListBlock({
    name: "RadioInputItemList",
    block: RadioInputItemBlock,
});

export const RadioInputListBlock: BlockInterface = createCompositeBlock(
    {
        name: "RadioInputList",
        category: BlockCategory.Form,
        displayName: <FormattedMessage id="blocks.radioInputList" defaultMessage="Radio Input List" />,
        blocks: {
            ...commonInputBlocks,
            items: {
                block: RadioInputItemListBlock,
                title: "Items",
            },
        },
    },
    (block) => {
        block.previewContent = (state) => [{ type: "text", content: state.label }];
        return block;
    },
);
