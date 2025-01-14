import { Field, SelectField, SelectFieldOption, TextField } from "@comet/admin";
import { BlockInterface, BlocksFinalForm, createFinalFormBlock, HiddenInSubroute } from "@comet/blocks-admin";
import { Paper, Typography } from "@mui/material";
import { SelectBlockData } from "@src/blocks.generated";
import { FieldInfoTextBlock, FieldInfoTextBlockField } from "@src/formBuilder/blocks/common/FieldInfoTextBlock";
import { createFieldBlock } from "@src/formBuilder/utils/createFieldBlock";
import { DisplaySection } from "@src/formBuilder/utils/DisplaySection";
import { PropsAndValidationGroup } from "@src/formBuilder/utils/PropsAndValidationGroup";
import { FormattedMessage } from "react-intl";

import { SelectOptionsBlock } from "./SelectOptionsBlock";

const selectTypeOptions: Array<SelectFieldOption<SelectBlockData["selectType"]>> = [
    { value: "singleSelect", label: <FormattedMessage id="blocks.select.type.singleSelect" defaultMessage="Single Select" /> },
    { value: "multiSelect", label: <FormattedMessage id="blocks.select.type.multiSelect" defaultMessage="Multi Select" /> },
];

const FinalFormSelectOptionsBlock = createFinalFormBlock(SelectOptionsBlock);

export const SelectBlock: BlockInterface = createFieldBlock({
    name: "Select",
    displayName: <FormattedMessage id="formBuilder.selectBlock" defaultMessage="Select" />,
    input2State: (input) => ({
        ...input,
        options: SelectOptionsBlock.input2State(input.options),
    }),
    state2Output: (state) => ({
        ...state,
        options: SelectOptionsBlock.state2Output(state.options),
    }),
    output2State: async (output, context) => ({
        ...output,
        options: await SelectOptionsBlock.output2State(output.options, context),
    }),
    createPreviewState: (state, previewCtx) => ({
        ...state,
        options: SelectOptionsBlock.createPreviewState(state.options, previewCtx),
    }),
    defaultValues: () => ({
        selectType: selectTypeOptions[0].value,
        label: "",
        placeholder: "",
        infoText: FieldInfoTextBlock.defaultValues(),
        mandatory: false,
        fieldName: "",
        options: SelectOptionsBlock.defaultValues(),
    }),
    AdminComponent: ({ state, updateState }) => {
        return (
            <BlocksFinalForm onSubmit={updateState} initialValues={state}>
                <HiddenInSubroute>
                    <DisplaySection>
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
                        <FieldInfoTextBlockField />
                    </DisplaySection>
                    <PropsAndValidationGroup />
                    <Paper variant="outlined" sx={{ p: 4 }}>
                        <Typography variant="h5">
                            <FormattedMessage id="formBuilder.fieldSection.selectOptions" defaultMessage="Select Options" />
                        </Typography>
                    </Paper>
                </HiddenInSubroute>
                <Field name="options" component={FinalFormSelectOptionsBlock} fullWidth />
            </BlocksFinalForm>
        );
    },
});
