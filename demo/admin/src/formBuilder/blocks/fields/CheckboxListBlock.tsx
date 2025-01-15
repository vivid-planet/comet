import { Field, TextField } from "@comet/admin";
import { BlockInterface, BlocksFinalForm, createFinalFormBlock, HiddenInSubroute } from "@comet/blocks-admin";
import { Paper, Typography } from "@mui/material";
import { createFieldBlock } from "@src/formBuilder/utils/createFieldBlock";
import { DisplayFieldGroup } from "@src/formBuilder/utils/FieldSection";
import { PropsAndValidationGroupFields } from "@src/formBuilder/utils/PropsAndValidationGroupFields";
import { FormattedMessage } from "react-intl";

import { HelperTextBlockField, RichTextBlock } from "../common/RichTextBlock";
import { CheckboxItemsBlock } from "./CheckboxItemsBlock";

const FinalFormCheckboxItemsBlock = createFinalFormBlock(CheckboxItemsBlock);

export const CheckboxListBlock: BlockInterface = createFieldBlock({
    name: "CheckboxList",
    displayName: <FormattedMessage id="formBuilder.checkboxListBlock.displayName" defaultMessage="Checkbox List" />,
    input2State: (input) => ({
        ...input,
        items: CheckboxItemsBlock.input2State(input.items),
    }),
    state2Output: (state) => ({
        ...state,
        items: CheckboxItemsBlock.state2Output(state.items),
    }),
    output2State: async (output, context) => ({
        ...output,
        items: await CheckboxItemsBlock.output2State(output.items, context),
    }),
    createPreviewState: (state, previewCtx) => ({
        ...state,
        items: CheckboxItemsBlock.createPreviewState(state.items, previewCtx),
    }),
    defaultValues: () => ({
        label: "",
        helperText: RichTextBlock.defaultValues(),
        mandatory: false,
        fieldName: "",
        items: CheckboxItemsBlock.defaultValues(),
    }),
    AdminComponent: ({ state, updateState }) => {
        return (
            <BlocksFinalForm onSubmit={updateState} initialValues={state}>
                <HiddenInSubroute>
                    <DisplayFieldGroup>
                        <TextField
                            name="label"
                            label={<FormattedMessage id="formBuilder.checkboxListBlock.label" defaultMessage="Label" />}
                            fullWidth
                        />
                        <HelperTextBlockField />
                    </DisplayFieldGroup>
                    <PropsAndValidationGroupFields />
                    <Paper variant="outlined" sx={{ p: 4 }}>
                        <Typography variant="h5">
                            <FormattedMessage id="formBuilder.checkboxListBlock.checkboxList" defaultMessage="Checkbox List" />
                        </Typography>
                    </Paper>
                </HiddenInSubroute>
                <Field name="items" component={FinalFormCheckboxItemsBlock} fullWidth />
            </BlocksFinalForm>
        );
    },
});
