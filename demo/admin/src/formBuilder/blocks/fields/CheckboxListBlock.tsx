import { Field, TextField } from "@comet/admin";
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
import { CheckboxItemsBlockData } from "@src/blocks.generated";
import { RichTextBlockField } from "@src/formBuilder/blocks/common/RichTextBlock";
import { createFieldBlock } from "@src/formBuilder/utils/createFieldBlock";
import { FieldNamesContext } from "@src/formBuilder/utils/FieldNamesContext";
import { DisplayFieldGroup } from "@src/formBuilder/utils/FieldSection";
import { PropsAndValidationGroupFields } from "@src/formBuilder/utils/PropsAndValidationGroupFields";
import { FormattedMessage } from "react-intl";

import { HelperTextBlockField, RichTextBlock } from "../common/RichTextBlock";

const ItemBlock: BlockInterface = {
    ...createBlockSkeleton(),
    name: "CheckboxItem",
    displayName: <FormattedMessage id="formBuilder.checkboxItemBlock.displayName" defaultMessage="Checkbox Item" />,
    previewContent: (state) => [{ type: "text", content: state.label.editorState.getCurrentContent().getPlainText() }],
    isValid: (state) => Boolean(state.fieldName),
    input2State: (input) => ({
        ...input,
        label: RichTextBlock.input2State(input.label),
        helperText: RichTextBlock.input2State(input.helperText),
    }),
    state2Output: (state) => ({
        ...state,
        label: RichTextBlock.state2Output(state.label),
        helperText: RichTextBlock.state2Output(state.helperText),
    }),
    output2State: async (output, context) => ({
        ...output,
        label: await RichTextBlock.output2State(output.label, context),
        helperText: await RichTextBlock.output2State(output.helperText, context),
    }),
    createPreviewState: (state, previewCtx) => ({
        ...state,
        label: RichTextBlock.createPreviewState(state.label, previewCtx),
        helperText: RichTextBlock.createPreviewState(state.helperText, previewCtx),
    }),
    defaultValues: () => ({
        label: RichTextBlock.defaultValues(),
        helperText: RichTextBlock.defaultValues(),
        fieldName: "",
        mandatory: false,
    }),
    AdminComponent: ({ state, updateState }) => {
        return (
            <BlocksFinalForm onSubmit={updateState} initialValues={state}>
                <DisplayFieldGroup>
                    <RichTextBlockField name="label" label={<FormattedMessage id="formBuilder.checkboxItemBlock.label" defaultMessage="Label" />} />
                    <HelperTextBlockField />
                </DisplayFieldGroup>
                <PropsAndValidationGroupFields />
            </BlocksFinalForm>
        );
    },
};

const ItemsBlock: BlockInterface = createListBlock({
    name: "CheckboxItems",
    displayName: <FormattedMessage id="formBuilder.checkboxItemsBlock.displayName" defaultMessage="Checkbox Items" />,
    block: ItemBlock,
    itemName: <FormattedMessage id="formBuilder.checkboxItemsBlock.itemName" defaultMessage="item" />,
    itemsName: <FormattedMessage id="formBuilder.checkboxItemsBlock.itemsName" defaultMessage="items" />,
});

const OriginalAdminComponent = ItemsBlock.AdminComponent;
const ItemsBlockAdminComponent: BlockAdminComponent<CheckboxItemsBlockData> = (props) => {
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
ItemsBlock.AdminComponent = ItemsBlockAdminComponent;
const FinalFormItemsBlock = createFinalFormBlock(ItemsBlock);

export const CheckboxListBlock: BlockInterface = createFieldBlock({
    name: "CheckboxList",
    displayName: <FormattedMessage id="formBuilder.checkboxListBlock.displayName" defaultMessage="Checkbox List" />,
    input2State: (input) => ({
        ...input,
        items: ItemsBlock.input2State(input.items),
    }),
    state2Output: (state) => ({
        ...state,
        items: ItemsBlock.state2Output(state.items),
    }),
    output2State: async (output, context) => ({
        ...output,
        items: await ItemsBlock.output2State(output.items, context),
    }),
    createPreviewState: (state, previewCtx) => ({
        ...state,
        items: ItemsBlock.createPreviewState(state.items, previewCtx),
    }),
    defaultValues: () => ({
        label: "",
        helperText: RichTextBlock.defaultValues(),
        mandatory: false,
        fieldName: "",
        items: ItemsBlock.defaultValues(),
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
                <Field name="items" component={FinalFormItemsBlock} fullWidth />
            </BlocksFinalForm>
        );
    },
});
