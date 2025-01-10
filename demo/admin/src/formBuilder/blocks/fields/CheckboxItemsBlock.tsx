import { BlockCategory, BlockInterface, createCompositeBlock, createListBlock } from "@comet/blocks-admin";
import { FormattedMessage } from "react-intl";

import { FieldInfoTextBlock } from "../common/FieldInfoTextBlock";
import { propsAndValidationGroup } from "../common/propsAndValidationGroup";

const CheckboxItemBlock: BlockInterface = createCompositeBlock(
    {
        name: "CheckboxItem",
        category: BlockCategory.Form,
        displayName: <FormattedMessage id="blocks.checkboxItems.itemName" defaultMessage="Checkbox Item" />,
        groups: {
            display: {
                title: <FormattedMessage id="blocks.checkboxItems.display" defaultMessage="Display" />,
                paper: true,
                blocks: {
                    label: {
                        block: FieldInfoTextBlock,
                        title: <FormattedMessage id="blocks.checkboxItems.text" defaultMessage="Text" />,
                    },
                    infoText: {
                        block: FieldInfoTextBlock,
                        title: <FormattedMessage id="blocks.checkboxItems.infoText" defaultMessage="Info Text" />,
                    },
                },
            },
            propsAndValidation: propsAndValidationGroup,
        },
    },
    (block) => {
        block.previewContent = (state) => [{ type: "text", content: state.label.editorState.getCurrentContent().getPlainText() }];
        return block;
    },
);

export const CheckboxItemsBlock: BlockInterface = createListBlock({
    name: "CheckboxItems",
    displayName: <FormattedMessage id="blocks.checkboxItems" defaultMessage="Checkbox Items" />,
    block: CheckboxItemBlock,
    itemName: <FormattedMessage id="blocks.checkboxItems.itemName" defaultMessage="item" />,
    itemsName: <FormattedMessage id="blocks.checkboxItems.itemsName" defaultMessage="items" />,
});
