import { SelectFieldOption } from "@comet/admin";
import {
    BlockCategory,
    BlockInterface,
    createCompositeBlock,
    createCompositeBlockSelectField,
    createCompositeBlockTextField,
} from "@comet/blocks-admin";
import { SelectBlockData } from "@src/blocks.generated";
import { FormattedMessage } from "react-intl";

import { FieldInfoTextBlock } from "../common/FieldInfoTextBlock";
import { propsAndValidationGroup } from "../common/propsAndValidationGroup";
import { SelectOptionsBlock } from "./SelectOptionsBlock";

const selectTypeOptions: Array<SelectFieldOption<SelectBlockData["selectType"]>> = [
    { value: "singleSelect", label: <FormattedMessage id="blocks.select.type.singleSelect" defaultMessage="Single Select" /> },
    { value: "multiSelect", label: <FormattedMessage id="blocks.select.type.multiSelect" defaultMessage="Multi Select" /> },
];

export const SelectBlock: BlockInterface = createCompositeBlock(
    {
        name: "Select",
        category: BlockCategory.Form,
        displayName: <FormattedMessage id="blocks.select" defaultMessage="Select" />,
        groups: {
            display: {
                title: <FormattedMessage id="blocks.select.display" defaultMessage="Display" />,
                paper: true,
                blocks: {
                    selectType: {
                        block: createCompositeBlockSelectField({
                            fieldProps: {
                                label: <FormattedMessage id="blocks.selectType.label" defaultMessage="Type" />,
                                fullWidth: true,
                                required: true,
                            },
                            defaultValue: selectTypeOptions[0].value,
                            options: selectTypeOptions,
                        }),
                        hiddenInSubroute: true,
                    },
                    label: {
                        block: createCompositeBlockTextField({
                            fieldProps: {
                                label: <FormattedMessage id="blocks.select.label" defaultMessage="Label" />,
                                fullWidth: true,
                            },
                        }),
                        hiddenInSubroute: true,
                    },
                    placeholder: {
                        block: createCompositeBlockTextField({
                            fieldProps: {
                                label: <FormattedMessage id="blocks.select.placeholderText" defaultMessage="Placeholder Text" />,
                                fullWidth: true,
                            },
                        }),
                        hiddenInSubroute: true,
                    },
                    infoText: {
                        block: FieldInfoTextBlock,
                        title: <FormattedMessage id="blocks.select.infoText" defaultMessage="Info Text" />,
                        hiddenInSubroute: true,
                    },
                },
            },
            propsAndValidation: propsAndValidationGroup,
            options: {
                title: <FormattedMessage id="blocks.select.options" defaultMessage="Select Options" />,
                blocks: {
                    options: {
                        block: SelectOptionsBlock,
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
