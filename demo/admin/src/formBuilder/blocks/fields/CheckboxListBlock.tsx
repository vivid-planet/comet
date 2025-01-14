import { BlockCategory, BlockInterface, createCompositeBlock, createCompositeBlockTextField } from "@comet/blocks-admin";
import { FormattedMessage } from "react-intl";

import { FieldInfoTextBlock } from "../common/FieldInfoTextBlock";
import { propsAndValidationGroup } from "../common/PropsAndValidationGroup";
import { CheckboxItemsBlock } from "./CheckboxItemsBlock";

export const CheckboxListBlock: BlockInterface = createCompositeBlock(
    {
        name: "CheckboxList",
        category: BlockCategory.Form,
        displayName: <FormattedMessage id="blocks.checkboxList" defaultMessage="Checkbox List" />,
        groups: {
            display: {
                title: <FormattedMessage id="blocks.checkboxList.display" defaultMessage="Display" />,
                paper: true,
                blocks: {
                    label: {
                        block: createCompositeBlockTextField({
                            fieldProps: {
                                label: <FormattedMessage id="blocks.checkboxList.label" defaultMessage="Label" />,
                                fullWidth: true,
                            },
                        }),
                        hiddenInSubroute: true,
                    },
                    infoText: {
                        block: FieldInfoTextBlock,
                        title: <FormattedMessage id="blocks.checkboxList.infoText" defaultMessage="Info Text" />,
                        hiddenInSubroute: true,
                    },
                },
            },
            propsAndValidation: propsAndValidationGroup,
            items: {
                title: <FormattedMessage id="blocks.checkboxList.items" defaultMessage="Checkbox Items" />,
                blocks: {
                    items: {
                        block: CheckboxItemsBlock,
                    },
                },
            },
        },
    },
    (block) => {
        block.previewContent = (state) => [{ type: "text", content: state.label }];
        return block;
    },
);
