import { BlockInterface, BlocksFinalForm, createBlockSkeleton, createListBlock } from "@comet/blocks-admin";
import { RichTextBlockField } from "@src/formBuilder/blocks/common/RichTextBlock";
import { FieldNamesContext } from "@src/formBuilder/utils/FieldNamesContext";
import { DisplayFieldGroup, PropsAndValidationFieldGroup } from "@src/formBuilder/utils/FieldSection";
import { FieldNameField } from "@src/formBuilder/utils/PropsAndValidationGroupFields";
import { FormattedMessage } from "react-intl";

import { HelperTextBlockField, RichTextBlock } from "../common/RichTextBlock";

const RadioItemBlock: BlockInterface = {
    ...createBlockSkeleton(),
    name: "RadioItem",
    displayName: <FormattedMessage id="formBuilder.radioItemBlock.displayName" defaultMessage="Radio Item" />,
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
    }),
    AdminComponent: ({ state, updateState }) => {
        return (
            <BlocksFinalForm onSubmit={updateState} initialValues={state}>
                <DisplayFieldGroup>
                    <RichTextBlockField name="label" label={<FormattedMessage id="formBuilder.radioItemBlock.label" defaultMessage="Label" />} />
                    <HelperTextBlockField />
                </DisplayFieldGroup>
                <PropsAndValidationFieldGroup>
                    <FieldNameField nameOfSlugSource="label" name="fieldName" />
                </PropsAndValidationFieldGroup>
            </BlocksFinalForm>
        );
    },
};

export const RadioItemsBlock: BlockInterface = createListBlock({
    name: "RadioItems",
    displayName: <FormattedMessage id="formBuilder.radioItemsBlock.displayName" defaultMessage="Radio Items" />,
    block: RadioItemBlock,
    itemName: <FormattedMessage id="formBuilder.radioItemsBlock.itemName" defaultMessage="item" />,
    itemsName: <FormattedMessage id="formBuilder.radioItemsBlock.itemsName" defaultMessage="items" />,
});

const OriginalAdminComponent = RadioItemsBlock.AdminComponent;
RadioItemsBlock.AdminComponent = ({ ...props }) => {
    // @ts-expect-error TODO: Fix this
    const fieldNames = props.state.blocks.filter(({ visible, props }) => visible && props.fieldName).map(({ props }) => props.fieldName);

    return (
        <FieldNamesContext.Provider value={fieldNames}>
            <OriginalAdminComponent {...props} />
        </FieldNamesContext.Provider>
    );
};
