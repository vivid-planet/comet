import { BlockInterface, BlocksFinalForm, createBlockSkeleton, createListBlock } from "@comet/blocks-admin";
import { RichTextBlockField } from "@src/formBuilder/blocks/common/RichTextBlock";
import { DisplaySection } from "@src/formBuilder/utils/DisplaySection";
import { FieldNamesContext } from "@src/formBuilder/utils/FieldNamesContext";
import { PropsAndValidationGroup } from "@src/formBuilder/utils/PropsAndValidationGroup";
import { FormattedMessage } from "react-intl";

import { HelperTextBlockField, RichTextBlock } from "../common/RichTextBlock";

const CheckboxItemBlock: BlockInterface = {
    ...createBlockSkeleton(),
    name: "CheckboxItem",
    displayName: <FormattedMessage id="blocks.checkboxItems.itemName" defaultMessage="Checkbox Item" />,
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
                <DisplaySection>
                    <RichTextBlockField name="label" label={<FormattedMessage id="blocks.checkboxItems.label" defaultMessage="Label" />} />
                    <HelperTextBlockField />
                </DisplaySection>
                <PropsAndValidationGroup />
            </BlocksFinalForm>
        );
    },
};

export const CheckboxItemsBlock: BlockInterface = createListBlock({
    name: "CheckboxItems",
    displayName: <FormattedMessage id="blocks.checkboxItems" defaultMessage="Checkbox Items" />,
    block: CheckboxItemBlock,
    itemName: <FormattedMessage id="blocks.checkboxItems.itemName" defaultMessage="item" />,
    itemsName: <FormattedMessage id="blocks.checkboxItems.itemsName" defaultMessage="items" />,
});

const OriginalAdminComponent = CheckboxItemsBlock.AdminComponent;
CheckboxItemsBlock.AdminComponent = ({ ...props }) => {
    // @ts-expect-error TODO: Fix this
    const fieldNames = props.state.blocks.filter(({ visible, props }) => visible && props.fieldName).map(({ props }) => props.fieldName);

    return (
        <FieldNamesContext.Provider value={fieldNames}>
            <OriginalAdminComponent {...props} />
        </FieldNamesContext.Provider>
    );
};
