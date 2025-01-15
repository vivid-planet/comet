import { TextField } from "@comet/admin";
import { BlockAdminComponent, BlockInterface, BlocksFinalForm, createBlockSkeleton, createListBlock } from "@comet/blocks-admin";
import { SelectOptionsBlockData } from "@src/blocks.generated";
import { FieldNamesContext } from "@src/formBuilder/utils/FieldNamesContext";
import { DisplayFieldGroup, PropsAndValidationFieldGroup } from "@src/formBuilder/utils/FieldSection";
import { FieldNameField } from "@src/formBuilder/utils/PropsAndValidationGroupFields";
import { FormattedMessage } from "react-intl";

const SelectOptionBlock: BlockInterface = {
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

export const SelectOptionsBlock: BlockInterface = createListBlock({
    name: "SelectOptions",
    displayName: <FormattedMessage id="formBuilder.selectOptionsBlock.displayName" defaultMessage="Select Options" />,
    block: SelectOptionBlock,
    itemName: <FormattedMessage id="formBuilder.selectOptionsBlock.item" defaultMessage="item" />,
    itemsName: <FormattedMessage id="formBuilder.selectOptionsBlock.items" defaultMessage="items" />,
});

const NewAdminComponent: BlockAdminComponent<SelectOptionsBlockData> = (props) => {
    const fieldNames = props.state.blocks
        .filter(({ visible, props }) => visible && props.fieldName)
        .map(({ props }) => props.fieldName)
        .filter((fieldName) => fieldName !== undefined);

    return (
        <FieldNamesContext.Provider value={fieldNames}>
            <SelectOptionsBlock.AdminComponent {...props} />
        </FieldNamesContext.Provider>
    );
};

SelectOptionsBlock.AdminComponent = NewAdminComponent;
