import { SelectField, SelectFieldOption, TextField } from "@comet/admin";
import { BlocksFinalForm } from "@comet/blocks-admin";
import { TextInputBlockData } from "@src/blocks.generated";
import { createFieldBlock } from "@src/formBuilder/utils/createFieldBlock";
import { DisplayFieldGroup } from "@src/formBuilder/utils/FieldSection";
import { FormattedMessage } from "react-intl";

import { PropsAndValidationGroupFields } from "../../utils/PropsAndValidationGroupFields";
import { HelperTextBlockField, RichTextBlock } from "../common/RichTextBlock";

const inputTypeOptions: Array<SelectFieldOption<TextInputBlockData["inputType"]>> = [
    { value: "text", label: <FormattedMessage id="formBuilder.textInputBlock.type.text" defaultMessage="Text" /> },
    { value: "email", label: <FormattedMessage id="formBuilder.textInputBlock.type.email" defaultMessage="Email" /> },
    { value: "phone", label: <FormattedMessage id="formBuilder.textInputBlock.type.phone" defaultMessage="Phone" /> },
    { value: "number", label: <FormattedMessage id="formBuilder.textInputBlock.type.number" defaultMessage="Number" /> },
];

export const TextInputBlock = createFieldBlock({
    name: "TextInput",
    displayName: <FormattedMessage id="formBuilder.textInputBlock.displayName" defaultMessage="Text Input" />,
    defaultValues: () => ({
        inputType: inputTypeOptions[0].value,
        label: "",
        placeholder: "",
        unit: "",
        helperText: RichTextBlock.defaultValues(),
        mandatory: false,
        fieldName: "",
    }),
    AdminComponent: ({ state, updateState }) => {
        return (
            <BlocksFinalForm onSubmit={updateState} initialValues={state}>
                <DisplayFieldGroup>
                    <SelectField
                        name="inputType"
                        label={<FormattedMessage id="formBuilder.textInputBlock.type" defaultMessage="Type" />}
                        fullWidth
                        options={inputTypeOptions}
                        required
                    />
                    <TextField name="label" label={<FormattedMessage id="formBuilder.textInputBlock.label" defaultMessage="Label" />} fullWidth />
                    <TextField
                        name="placeholder"
                        label={<FormattedMessage id="formBuilder.textInputBlock.placeholderText" defaultMessage="Placeholder Text" />}
                        fullWidth
                    />
                    {state?.inputType === "number" && (
                        <TextField name="unit" label={<FormattedMessage id="formBuilder.textInputBlock.unit" defaultMessage="Unit" />} fullWidth />
                    )}
                    <HelperTextBlockField />
                </DisplayFieldGroup>
                <PropsAndValidationGroupFields />
            </BlocksFinalForm>
        );
    },
});
