import { SelectFieldOption } from "@comet/admin";
import {
    BlockCategory,
    BlockInterface,
    createCompositeBlock,
    createCompositeBlockSelectField,
    createCompositeBlockTextField,
} from "@comet/blocks-admin";
import { TextInputBlockData } from "@src/blocks.generated";
import { FormattedMessage } from "react-intl";

import { FieldInfoTextBlock } from "../common/FieldInfoTextBlock";
import { propsAndValidationGroup } from "../common/propsAndValidationGroup";

const inputTypeOptions: Array<SelectFieldOption<TextInputBlockData["inputType"]>> = [
    { value: "text", label: <FormattedMessage id="blocks.textInput.type.text" defaultMessage="Text" /> },
    { value: "email", label: <FormattedMessage id="blocks.textInput.type.email" defaultMessage="Email" /> },
    { value: "phone", label: <FormattedMessage id="blocks.textInput.type.phone" defaultMessage="Phone" /> },
    { value: "number", label: <FormattedMessage id="blocks.textInput.type.number" defaultMessage="Number" /> },
];

export const TextInputBlock: BlockInterface = createCompositeBlock(
    {
        name: "TextInput",
        category: BlockCategory.Form,
        displayName: <FormattedMessage id="blocks.textInput" defaultMessage="Text Input" />,
        groups: {
            display: {
                title: <FormattedMessage id="blocks.textInput.display" defaultMessage="Display" />,
                paper: true,
                blocks: {
                    inputType: {
                        block: createCompositeBlockSelectField({
                            fieldProps: {
                                label: <FormattedMessage id="blocks.textInput.type" defaultMessage="Type" />,
                                fullWidth: true,
                                required: true,
                            },
                            defaultValue: inputTypeOptions[0].value,
                            options: inputTypeOptions,
                        }),
                    },
                    label: {
                        block: createCompositeBlockTextField({
                            fieldProps: {
                                label: <FormattedMessage id="blocks.textInput.label" defaultMessage="Label" />,
                                fullWidth: true,
                            },
                        }),
                    },
                    placeholder: {
                        block: createCompositeBlockTextField({
                            fieldProps: {
                                label: <FormattedMessage id="blocks.textInput.placeholderText" defaultMessage="Placeholder Text" />,
                                fullWidth: true,
                            },
                        }),
                    },
                    unit: {
                        block: createCompositeBlockTextField({
                            fieldProps: {
                                label: <FormattedMessage id="blocks.textInput.unit" defaultMessage="Unit" />,
                                fullWidth: true,
                            },
                        }),
                        hiddenForState: (state: TextInputBlockData) => state.inputType !== "number",
                    },
                    infoText: {
                        block: FieldInfoTextBlock,
                        title: <FormattedMessage id="blocks.textInput.infoText" defaultMessage="Info Text" />,
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
