import { TextField } from "@comet/admin";
import { BlockInterface, BlocksFinalForm, createBlockSkeleton, createListBlock } from "@comet/blocks-admin";
import { DisplaySection, FieldSection } from "@src/formBuilder/utils/DisplaySection";
import { FieldNamesContext } from "@src/formBuilder/utils/FieldNamesContext";
import { FieldNameField } from "@src/formBuilder/utils/PropsAndValidationGroup";
import { FormattedMessage } from "react-intl";

const SelectOptionBlock: BlockInterface = {
    ...createBlockSkeleton(),
    name: "SelectItem",
    displayName: <FormattedMessage id="blocks.selectOptions.itemName" defaultMessage="Select Item" />,
    previewContent: (state) => [{ type: "text", content: `${state.text}${state.fieldName ? ` (${state.fieldName})` : ""}` }],
    isValid: (state) => Boolean(state.fieldName),
    defaultValues: () => ({
        text: "",
        fieldName: "",
    }),
    AdminComponent: ({ state, updateState }) => {
        return (
            <BlocksFinalForm onSubmit={updateState} initialValues={state}>
                <DisplaySection>
                    <TextField name="text" label={<FormattedMessage id="blocks.selectOption.text" defaultMessage="Text" />} fullWidth />
                </DisplaySection>
                <FieldSection title={<FormattedMessage id="blocks.selectOptions.propsAndValidation" defaultMessage="Props and Validation" />}>
                    <FieldNameField nameOfSlugSource="text" name="fieldName" />
                </FieldSection>
            </BlocksFinalForm>
        );
    },
};

export const SelectOptionsBlock: BlockInterface = createListBlock({
    name: "SelectOptions",
    displayName: <FormattedMessage id="blocks.selectOptions" defaultMessage="Select Options" />,
    block: SelectOptionBlock,
    itemName: <FormattedMessage id="blocks.selectOptions.itemName" defaultMessage="item" />,
    itemsName: <FormattedMessage id="blocks.selectOptions.itemsName" defaultMessage="items" />,
});

const OriginalAdminComponent = SelectOptionsBlock.AdminComponent;
SelectOptionsBlock.AdminComponent = ({ ...props }) => {
    // @ts-expect-error TODO: Fix this
    const fieldNames = props.state.blocks.filter(({ visible, props }) => visible && props.fieldName).map(({ props }) => props.fieldName);

    return (
        <FieldNamesContext.Provider value={fieldNames}>
            <OriginalAdminComponent {...props} />
        </FieldNamesContext.Provider>
    );
};
