import { BlockCategory, BlockInterface, createCompositeBlock, createCompositeBlockTextField } from "@comet/blocks-admin";
import { FormattedMessage } from "react-intl";

import { FieldInfoTextBlock } from "../common/FieldInfoTextBlock";
import { propsAndValidationGroup } from "../common/propsAndValidationGroup";

export const TextAreaBlock: BlockInterface = createCompositeBlock(
    {
        name: "TextArea",
        category: BlockCategory.Form,
        displayName: <FormattedMessage id="blocks.textArea" defaultMessage="Text Area" />,
        groups: {
            display: {
                title: <FormattedMessage id="blocks.textArea.display" defaultMessage="Display" />,
                paper: true,
                blocks: {
                    label: {
                        block: createCompositeBlockTextField({
                            fieldProps: {
                                label: <FormattedMessage id="blocks.textArea.label" defaultMessage="Label" />,
                                fullWidth: true,
                            },
                        }),
                    },
                    placeholder: {
                        block: createCompositeBlockTextField({
                            fieldProps: {
                                label: <FormattedMessage id="blocks.textArea.placeholderText" defaultMessage="Placeholder Text" />,
                                fullWidth: true,
                            },
                        }),
                    },
                    infoText: {
                        block: FieldInfoTextBlock,
                        title: <FormattedMessage id="blocks.textArea.infoText" defaultMessage="Info Text" />,
                    },
                },
            },
            propsAndValidation: propsAndValidationGroup,
        },
    },
    (block) => {
        block.previewContent = (state) => [{ type: "text", content: state.label }];
        return block;
    },
);
