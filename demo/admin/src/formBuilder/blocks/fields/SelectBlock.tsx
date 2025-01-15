import { Field, SelectField, SelectFieldOption, TextField } from "@comet/admin";
import {
    BlockAdminComponent,
    BlockInterface,
    BlocksFinalForm,
    createBlockSkeleton,
    createFinalFormBlock,
    createListBlock,
    HiddenInSubroute,
} from "@comet/blocks-admin";
import { Paper, Typography } from "@mui/material";
import { SelectBlockData, SelectOptionsBlockData } from "@src/blocks.generated";
import { createFieldBlock } from "@src/formBuilder/utils/createFieldBlock";
import { FieldNamesContext } from "@src/formBuilder/utils/FieldNamesContext";
import { DisplayFieldGroup, PropsAndValidationFieldGroup } from "@src/formBuilder/utils/FieldSection";
import { FieldNameField, PropsAndValidationGroupFields } from "@src/formBuilder/utils/PropsAndValidationGroupFields";
import { FormattedMessage } from "react-intl";

import { HelperTextBlockField, RichTextBlock } from "../common/RichTextBlock";

const OptionBlock: BlockInterface = {
    ...createBlockSkeleton(),
    name: "SelectItem",
    displayName: <FormattedMessage id="formBuilder.selectOptionBlock.displayName" defaultMessage="Select Option" />,
    previewContent: (state) => [{ type: "text", content: `${state.text}${state.fieldName ? ` (${state.fieldName})` : ""}` }],
    isValid: (state) => Boolean(state.fieldName),
    defaultValues: () => ({
        text: "",
        fieldName: "",
    }),
    AdminComponent: ({ state, updateState }) => {
        return (
            <BlocksFinalForm onSubmit={updateState} initialValues={state}>
                <DisplayFieldGroup>
                    <TextField name="text" label={<FormattedMessage id="formBuilder.selectOptionBlock.text" defaultMessage="Text" />} fullWidth />
                </DisplayFieldGroup>
                <PropsAndValidationFieldGroup>
                    <FieldNameField nameOfSlugSource="text" name="fieldName" />
                </PropsAndValidationFieldGroup>
            </BlocksFinalForm>
        );
    },
};

const OptionsBlock: BlockInterface = createListBlock({
    name: "SelectOptions",
    displayName: <FormattedMessage id="formBuilder.selectOptionsBlock.displayName" defaultMessage="Select Options" />,
    block: OptionBlock,
    itemName: <FormattedMessage id="formBuilder.selectOptionsBlock.item" defaultMessage="item" />,
    itemsName: <FormattedMessage id="formBuilder.selectOptionsBlock.items" defaultMessage="items" />,
});

const OriginalAdminComponent = OptionsBlock.AdminComponent;
const OptionsBlockAdminComponent: BlockAdminComponent<SelectOptionsBlockData> = (props) => {
    const fieldNames = props.state.blocks
        .filter(({ visible, props }) => visible && props.fieldName)
        .map(({ props }) => props.fieldName)
        .filter((fieldName) => fieldName !== undefined);

    return (
        <FieldNamesContext.Provider value={fieldNames}>
            <OriginalAdminComponent {...props} />
        </FieldNamesContext.Provider>
    );
};
OptionsBlock.AdminComponent = OptionsBlockAdminComponent;
const FinalFormOptionsBlock = createFinalFormBlock(OptionsBlock);

const selectTypeOptions: Array<SelectFieldOption<SelectBlockData["selectType"]>> = [
    { value: "singleSelect", label: <FormattedMessage id="formBuilder.selectBlock.type.singleSelect" defaultMessage="Single Select" /> },
    { value: "multiSelect", label: <FormattedMessage id="formBuilder.selectBlock.type.multiSelect" defaultMessage="Multi Select" /> },
];

export const SelectBlock: BlockInterface = createFieldBlock({
    name: "Select",
    displayName: <FormattedMessage id="formBuilder.selectBlock.displayName" defaultMessage="Select" />,
    input2State: (input) => ({
        ...input,
        options: OptionsBlock.input2State(input.options),
    }),
    state2Output: (state) => ({
        ...state,
        options: OptionsBlock.state2Output(state.options),
    }),
    output2State: async (output, context) => ({
        ...output,
        options: await OptionsBlock.output2State(output.options, context),
    }),
    createPreviewState: (state, previewCtx) => ({
        ...state,
        options: OptionsBlock.createPreviewState(state.options, previewCtx),
    }),
    defaultValues: () => ({
        selectType: selectTypeOptions[0].value,
        label: "",
        placeholder: "",
        helperText: RichTextBlock.defaultValues(),
        mandatory: false,
        fieldName: "",
        options: OptionsBlock.defaultValues(),
    }),
    AdminComponent: ({ state, updateState }) => {
        return (
            <BlocksFinalForm onSubmit={updateState} initialValues={state}>
                <HiddenInSubroute>
                    <DisplayFieldGroup>
                        <SelectField
                            name="selectType"
                            label={<FormattedMessage id="formBuilder.selectBlock.type" defaultMessage="Type" />}
                            fullWidth
                            options={selectTypeOptions}
                            required
                        />
                        <TextField name="label" label={<FormattedMessage id="formBuilder.selectBlock.label" defaultMessage="Label" />} fullWidth />
                        <TextField
                            name="placeholder"
                            label={<FormattedMessage id="formBuilder.selectBlock.placeholderText" defaultMessage="Placeholder Text" />}
                            fullWidth
                        />
                        <HelperTextBlockField />
                    </DisplayFieldGroup>
                    <PropsAndValidationGroupFields />
                    <Paper variant="outlined" sx={{ p: 4 }}>
                        <Typography variant="h5">
                            <FormattedMessage id="formBuilder.fieldSection.selectOptions" defaultMessage="Select Options" />
                        </Typography>
                    </Paper>
                </HiddenInSubroute>
                <Field name="options" component={FinalFormOptionsBlock} fullWidth />
            </BlocksFinalForm>
        );
    },
});
