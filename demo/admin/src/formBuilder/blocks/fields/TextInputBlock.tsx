import { SelectField, SelectFieldOption, TextField } from "@comet/admin";
import { BlocksFinalForm } from "@comet/blocks-admin";
import { TextInputBlockData } from "@src/blocks.generated";
import { createFieldBlock } from "@src/formBuilder/utils/createFieldBlock";
import { DisplaySection } from "@src/formBuilder/utils/DisplaySection";
import { FormattedMessage } from "react-intl";

import { PropsAndValidationGroup } from "../../utils/PropsAndValidationGroup";
import { HelperTextBlockField, RichTextBlock } from "../common/RichTextBlock";

const inputTypeOptions: Array<SelectFieldOption<TextInputBlockData["inputType"]>> = [
    { value: "text", label: <FormattedMessage id="blocks.textInput.type.text" defaultMessage="Text" /> },
    { value: "email", label: <FormattedMessage id="blocks.textInput.type.email" defaultMessage="Email" /> },
    { value: "phone", label: <FormattedMessage id="blocks.textInput.type.phone" defaultMessage="Phone" /> },
    { value: "number", label: <FormattedMessage id="blocks.textInput.type.number" defaultMessage="Number" /> },
];

export const TextInputBlock = createFieldBlock({
    name: "TextInput",
    displayName: <FormattedMessage id="blocks.textInput" defaultMessage="Text Input" />,
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
                <DisplaySection>
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
                    <HelperTextBlockField />
                </DisplaySection>
                <PropsAndValidationGroup />
            </BlocksFinalForm>
        );
    },
});
