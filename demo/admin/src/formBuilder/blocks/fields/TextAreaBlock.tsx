import { TextField } from "@comet/admin";
import { BlocksFinalForm } from "@comet/blocks-admin";
import { createFieldBlock } from "@src/formBuilder/utils/createFieldBlock";
import { DisplayFieldGroup } from "@src/formBuilder/utils/FieldSection";
import { PropsAndValidationGroupFields } from "@src/formBuilder/utils/PropsAndValidationGroupFields";
import { FormattedMessage } from "react-intl";

import { HelperTextBlockField, RichTextBlock } from "../common/RichTextBlock";

export const TextAreaBlock = createFieldBlock({
    name: "TextArea",
    displayName: <FormattedMessage id="formBuilder.textAreaBlock.displayName" defaultMessage="Text Area" />,
    defaultValues: () => ({
        label: "",
        placeholder: "",
        helperText: RichTextBlock.defaultValues(),
        mandatory: false,
        fieldName: "",
    }),
    AdminComponent: ({ state, updateState }) => {
        return (
            <BlocksFinalForm onSubmit={updateState} initialValues={state}>
                <DisplayFieldGroup>
                    <TextField name="label" label={<FormattedMessage id="formBuilder.textAreaBlock.label" defaultMessage="Label" />} fullWidth />
                    <TextField
                        name="placeholder"
                        label={<FormattedMessage id="formBuilder.textAreaBlock.placeholderText" defaultMessage="Placeholder Text" />}
                        fullWidth
                    />
                    <HelperTextBlockField />
                </DisplayFieldGroup>
                <PropsAndValidationGroupFields />
            </BlocksFinalForm>
        );
    },
});
