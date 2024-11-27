// TODO: Implement this block properly

import { BlockCategory, BlockInterface, createCompositeBlock, createCompositeBlockTextField, createListBlock } from "@comet/blocks-admin";
import { InputRichTextBlock } from "@src/pages/formBuilder/blocks/fields/InputRichTextBlock";
import { FormattedMessage } from "react-intl";

import { commonInputBlocks } from "./commonInputBlocks";

const CheckboxInputItemBlock: BlockInterface = createCompositeBlock({
    name: "CheckboxInputItem",
    displayName: "Checkbox Input Item",
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

const CheckboxInputItemListBlock = createListBlock({
    name: "CheckboxInputItemList",
    block: CheckboxInputItemBlock,
});

export const CheckboxInputListBlock: BlockInterface = createCompositeBlock(
    {
        name: "CheckboxInputList",
        category: BlockCategory.Form,
        displayName: <FormattedMessage id="blocks.checkboxInputList" defaultMessage="Checkbox Input List" />,
        blocks: {
            ...commonInputBlocks,
            items: {
                block: CheckboxInputItemListBlock,
                title: "Items",
            },
        },
    },
    (block) => {
        block.previewContent = (state) => [{ type: "text", content: state.label }];
        return block;
    },
);
