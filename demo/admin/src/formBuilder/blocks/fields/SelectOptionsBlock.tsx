import { BlockCategory, BlockInterface, createCompositeBlock, createCompositeBlockTextField, createListBlock } from "@comet/blocks-admin";
import { FormattedMessage } from "react-intl";

const SelectOptionBlock: BlockInterface = createCompositeBlock(
    {
        name: "SelectOption",
        category: BlockCategory.Form,
        displayName: <FormattedMessage id="blocks.selectOptions.itemName" defaultMessage="Select Item" />,
        groups: {
            display: {
                title: <FormattedMessage id="blocks.selectOptions.display" defaultMessage="Display" />,
                paper: true,
                blocks: {
                    text: {
                        block: createCompositeBlockTextField({
                            fieldProps: {
                                label: <FormattedMessage id="blocks.selectOptions.text" defaultMessage="Text" />,
                                fullWidth: true,
                            },
                        }),
                    },
                },
            },
            propsAndValidation: {
                title: <FormattedMessage id="blocks.selectOptions.propsAndValidation" defaultMessage="Props and Validation" />,
                paper: true,
                blocks: {
                    fieldName: {
                        block: createCompositeBlockTextField({
                            fieldProps: {
                                label: <FormattedMessage id="blocks.selectOptions.fieldName" defaultMessage="Field Name" />,
                                fullWidth: true,
                            },
                        }),
                    },
                },
            },
        },
    },
    (block) => {
        block.previewContent = (state) => [{ type: "text", content: state.text }];
        return block;
    },
);

export const SelectOptionsBlock: BlockInterface = createListBlock({
    name: "SelectOptions",
    displayName: <FormattedMessage id="blocks.selectOptions" defaultMessage="Select Options" />,
    block: SelectOptionBlock,
    itemName: <FormattedMessage id="blocks.selectOptions.itemName" defaultMessage="option" />,
    itemsName: <FormattedMessage id="blocks.selectOptions.itemsName" defaultMessage="options" />,
});
