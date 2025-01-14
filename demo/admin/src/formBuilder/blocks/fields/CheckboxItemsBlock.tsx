import { BlockInterface, BlocksFinalForm, createBlockSkeleton, createListBlock } from "@comet/blocks-admin";
import { DisplaySection } from "@src/formBuilder/utils/DisplaySection";
import { FieldNamesContext } from "@src/formBuilder/utils/FieldNamesContext";
import { PropsAndValidationGroup } from "@src/formBuilder/utils/PropsAndValidationGroup";
import { FormattedMessage } from "react-intl";

import { FieldInfoTextBlock, FieldInfoTextBlockField } from "../common/FieldInfoTextBlock";

const CheckboxItemBlock: BlockInterface = {
    ...createBlockSkeleton(),
    name: "CheckboxItem",
    displayName: <FormattedMessage id="blocks.checkboxItems.itemName" defaultMessage="Checkbox Item" />,
    previewContent: (state) => [{ type: "text", content: state.label.editorState.getCurrentContent().getPlainText() }],
    isValid: (state) => Boolean(state.fieldName),
    input2State: (input) => ({
        ...input,
        label: FieldInfoTextBlock.input2State(input.label),
        infoText: FieldInfoTextBlock.input2State(input.infoText),
    }),
    state2Output: (state) => {
        const output = {
            ...state,
            label: FieldInfoTextBlock.state2Output(state.label),
            infoText: FieldInfoTextBlock.state2Output(state.infoText),
        };
        return output;
    },
    output2State: async (output, context) => ({
        ...output,
        label: await FieldInfoTextBlock.output2State(output.label, context),
        infoText: await FieldInfoTextBlock.output2State(output.infoText, context),
    }),
    createPreviewState: (state, previewCtx) => ({
        ...state,
        label: FieldInfoTextBlock.createPreviewState(state.label, previewCtx),
        infoText: FieldInfoTextBlock.createPreviewState(state.infoText, previewCtx),
    }),
    defaultValues: () => ({
        label: FieldInfoTextBlock.defaultValues(),
        infoText: FieldInfoTextBlock.defaultValues(),
        fieldName: "",
        mandatory: false,
    }),
    AdminComponent: ({ state, updateState }) => {
        return (
            <BlocksFinalForm onSubmit={updateState} initialValues={state}>
                <DisplaySection>
                    <FieldInfoTextBlockField name="label" label={<FormattedMessage id="blocks.checkboxItems.label" defaultMessage="Label" />} />
                    <FieldInfoTextBlockField
                        name="infoText"
                        label={<FormattedMessage id="blocks.checkboxItems.infoText" defaultMessage="Info Text" />}
                    />
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
