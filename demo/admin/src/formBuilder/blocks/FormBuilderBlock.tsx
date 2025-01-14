import { Alert } from "@comet/admin";
import { createBlocksBlock } from "@comet/blocks-admin";
import { createContext, useContext } from "react";
import { FormattedMessage } from "react-intl";

import { CheckboxListBlock } from "./fields/CheckboxListBlock";
import { SelectBlock } from "./fields/SelectBlock";
import { TextAreaBlock } from "./fields/TextAreaBlock";
import { TextInputBlock } from "./fields/TextInputBlock";

export const FormBuilderBlock = createBlocksBlock({
    name: "FormBuilder",
    supportedBlocks: {
        textInput: TextInputBlock,
        textArea: TextAreaBlock,
        select: SelectBlock,
        checkboxList: CheckboxListBlock,
    },
});

const FormBuilderFieldNamesContext = createContext<string[]>([]);
export const useFormBuilderFieldNames = () => useContext(FormBuilderFieldNamesContext);

const OriginalAdminComponent = FormBuilderBlock.AdminComponent;
FormBuilderBlock.AdminComponent = ({ ...props }) => {
    const fieldNames = props.state.blocks.filter(({ visible, props }) => visible && props.fieldName).map(({ props }) => props.fieldName);
    const uniqueDuplicateFieldNames = [...new Set(fieldNames.filter((fieldName, index) => fieldNames.indexOf(fieldName) !== index))];

    return (
        <FormBuilderFieldNamesContext.Provider value={fieldNames}>
            {Boolean(uniqueDuplicateFieldNames.length) && (
                <Alert
                    title={<FormattedMessage id="blocks.formBuilder.duplicateFieldNames.warning" defaultMessage="Duplicate field names" />}
                    severity="warning"
                    sx={{ mb: 4 }}
                >
                    <FormattedMessage
                        id="blocks.formBuilder.duplicateFieldNames.warning.details"
                        defaultMessage="Multiple fields with the same name exist which will not allow them to store unique values. Affected {numberOfDuplicateFields, plural, one {field} other {fields}}: {duplicateFields}."
                        values={{
                            duplicateFields: uniqueDuplicateFieldNames.map((fieldName) => `"${fieldName}"`).join(", "),
                            numberOfDuplicateFields: uniqueDuplicateFieldNames.length,
                        }}
                    />
                </Alert>
            )}
            <OriginalAdminComponent {...props} />
        </FormBuilderFieldNamesContext.Provider>
    );
};
