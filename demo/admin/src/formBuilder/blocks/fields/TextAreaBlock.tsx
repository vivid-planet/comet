import { TextField } from "@comet/admin";
import { BlocksFinalForm } from "@comet/blocks-admin";
import { createFieldBlock } from "@src/formBuilder/utils/createFieldBlock";
import { DisplaySection } from "@src/formBuilder/utils/DisplaySection";
import { PropsAndValidationGroup } from "@src/formBuilder/utils/PropsAndValidationGroup";
import { FormattedMessage } from "react-intl";

import { HelperTextBlockField, RichTextBlock } from "../common/RichTextBlock";

export const TextAreaBlock = createFieldBlock({
    name: "TextArea",
    displayName: <FormattedMessage id="blocks.textArea" defaultMessage="Text Area" />,
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
                <DisplaySection>
                    <TextField name="label" label={<FormattedMessage id="blocks.textArea.label" defaultMessage="Label" />} fullWidth />
                    <TextField
                        name="placeholder"
                        label={<FormattedMessage id="blocks.textArea.placeholderText" defaultMessage="Placeholder Text" />}
                        fullWidth
                    />
                    <HelperTextBlockField />
                </DisplaySection>
                <PropsAndValidationGroup />
            </BlocksFinalForm>
        );
    },
});
