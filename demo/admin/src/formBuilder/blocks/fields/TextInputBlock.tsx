import { Field, SelectField, SelectFieldOption, TextField } from "@comet/admin";
import { BlockCategory, BlockInterface, BlocksFinalForm, BlockState, createBlockSkeleton, createFinalFormBlock } from "@comet/blocks-admin";
import { Paper, Typography } from "@mui/material";
import { TextInputBlockData } from "@src/blocks.generated";
import { FormattedMessage } from "react-intl";

import { FieldInfoTextBlock } from "../common/FieldInfoTextBlock";
import { PropsAndValidationGroup } from "../common/PropsAndValidationGroup";

const inputTypeOptions: Array<SelectFieldOption<TextInputBlockData["inputType"]>> = [
    { value: "text", label: <FormattedMessage id="blocks.textInput.type.text" defaultMessage="Text" /> },
    { value: "email", label: <FormattedMessage id="blocks.textInput.type.email" defaultMessage="Email" /> },
    { value: "phone", label: <FormattedMessage id="blocks.textInput.type.phone" defaultMessage="Phone" /> },
    { value: "number", label: <FormattedMessage id="blocks.textInput.type.number" defaultMessage="Number" /> },
];

type Values = Pick<TextInputBlockData, "inputType" | "label" | "placeholder" | "unit" | "mandatory" | "fieldName"> & {
    infoText: BlockState<typeof FieldInfoTextBlock>;
};

const FFInfoTextBlock = createFinalFormBlock(FieldInfoTextBlock);

export const TextInputBlock: BlockInterface = {
    ...createBlockSkeleton(),
    name: "TextInput",
    category: BlockCategory.Form,
    isValid: (state) => Boolean(state.fieldName),
    displayName: <FormattedMessage id="blocks.textInput" defaultMessage="Text Input" />,
    defaultValues: () => ({
        inputType: inputTypeOptions[0].value,
        label: "",
        placeholder: "",
        unit: "",
        infoText: FieldInfoTextBlock.defaultValues(),
        mandatory: false,
        fieldName: "",
    }),
    previewContent: (state) => [{ type: "text", content: `${state.label}${state.fieldName ? ` (${state.fieldName})` : ""}` }],
    input2State: (input) => ({
        ...input,
        infoText: input.infoText ? FieldInfoTextBlock.input2State(input.infoText) : FieldInfoTextBlock.defaultValues(),
    }),
    state2Output: (state) => ({
        ...state,
        infoText: FieldInfoTextBlock.state2Output(state.infoText),
    }),
    output2State: async (output, context) => ({
        ...output,
        infoText: await FieldInfoTextBlock.output2State(output.infoText, context),
    }),
    createPreviewState: (state, previewCtx) => ({
        ...state,
        infoText: FieldInfoTextBlock.createPreviewState(state.infoText, previewCtx),
    }),
    AdminComponent: ({ state, updateState }) => {
        return (
            <BlocksFinalForm<Values> onSubmit={updateState} initialValues={state}>
                <Paper sx={{ padding: 4, mb: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        <FormattedMessage id="blocks.textInput.display" defaultMessage="Display" />
                    </Typography>
                    <SelectField
                        name="inputType"
                        label={<FormattedMessage id="blocks.textInput.type" defaultMessage="Type" />}
                        fullWidth
                        options={inputTypeOptions}
                        required
                    />
                    <TextField name="label" label={<FormattedMessage id="blocks.textInput.label" defaultMessage="Label" />} fullWidth />
                    <TextField
                        name="placeholder"
                        label={<FormattedMessage id="blocks.textInput.placeholderText" defaultMessage="Placeholder Text" />}
                        fullWidth
                    />
                    {state?.inputType === "number" && (
                        <TextField name="unit" label={<FormattedMessage id="blocks.textInput.unit" defaultMessage="Unit" />} fullWidth />
                    )}
                    <Field name="infoText" component={FFInfoTextBlock} />
                </Paper>
                <PropsAndValidationGroup />
            </BlocksFinalForm>
        );
    },
};
