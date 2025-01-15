import { Field, TextField } from "@comet/admin";
import { BlockInterface, BlocksFinalForm, createFinalFormBlock, HiddenInSubroute } from "@comet/blocks-admin";
import { Paper, Typography } from "@mui/material";
import { createFieldBlock } from "@src/formBuilder/utils/createFieldBlock";
import { DisplayFieldGroup } from "@src/formBuilder/utils/FieldSection";
import { PropsAndValidationGroupFields } from "@src/formBuilder/utils/PropsAndValidationGroupFields";
import { FormattedMessage } from "react-intl";

import { HelperTextBlockField, RichTextBlock } from "../common/RichTextBlock";
import { RadioItemsBlock } from "./RadioItemsBlock";

const FinalFormRadioItemsBlock = createFinalFormBlock(RadioItemsBlock);

export const RadioBlock: BlockInterface = createFieldBlock({
    name: "Radio",
    displayName: <FormattedMessage id="formBuilder.radioBlock.displayName" defaultMessage="Radio Button List" />,
    input2State: (input) => ({
        ...input,
        items: RadioItemsBlock.input2State(input.items),
    }),
    state2Output: (state) => ({
        ...state,
        items: RadioItemsBlock.state2Output(state.items),
    }),
    output2State: async (output, context) => ({
        ...output,
        items: await RadioItemsBlock.output2State(output.items, context),
    }),
    createPreviewState: (state, previewCtx) => ({
        ...state,
        items: RadioItemsBlock.createPreviewState(state.items, previewCtx),
    }),
    defaultValues: () => ({
        label: "",
        helperText: RichTextBlock.defaultValues(),
        mandatory: false,
        fieldName: "",
        items: RadioItemsBlock.defaultValues(),
    }),
    AdminComponent: ({ state, updateState }) => {
        return (
            <BlocksFinalForm onSubmit={updateState} initialValues={state}>
                <HiddenInSubroute>
                    <DisplayFieldGroup>
                        <TextField name="label" label={<FormattedMessage id="formBuilder.radioBlock.label" defaultMessage="Label" />} fullWidth />
                        <HelperTextBlockField />
                    </DisplayFieldGroup>
                    <PropsAndValidationGroupFields />
                    <Paper variant="outlined" sx={{ p: 4 }}>
                        <Typography variant="h5">
                            <FormattedMessage id="formBuilder.radioBlock.radioButtonList" defaultMessage="Radio Button List" />
                        </Typography>
                    </Paper>
                </HiddenInSubroute>
                <Field name="items" component={FinalFormRadioItemsBlock} fullWidth />
            </BlocksFinalForm>
        );
    },
});
