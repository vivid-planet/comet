import { Alert } from "@comet/admin";
import { createBlocksBlock, HiddenInSubroute } from "@comet/blocks-admin";
import { useFieldNames } from "@src/formBuilder/utils/FieldNamesContext";
import { FormattedMessage } from "react-intl";

import { FieldNamesContext } from "../utils/FieldNamesContext";
import { CheckboxListBlock } from "./fields/CheckboxListBlock";
import { RadioBlock } from "./fields/RadioBlock";
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
        radio: RadioBlock,
    },
});

const DuplicateFieldNamesWarning = () => {
    const { duplicateFieldNames } = useFieldNames();

    if (duplicateFieldNames.length) {
        return (
            <Alert
                title={<FormattedMessage id="blocks.formBuilder.duplicateFieldNames.warning" defaultMessage="Duplicate field names" />}
                severity="warning"
                sx={{ mb: 4 }}
            >
                <FormattedMessage
                    id="blocks.formBuilder.duplicateFieldNames.warning.details"
                    defaultMessage="Multiple fields with the same name exist which will not allow them to store unique values. Affected {numberOfDuplicateFields, plural, one {field} other {fields}}: {duplicateFields}."
                    values={{
                        duplicateFields: duplicateFieldNames.map((fieldName) => `"${fieldName}"`).join(", "),
                        numberOfDuplicateFields: duplicateFieldNames.length,
                    }}
                />
            </Alert>
        );
    }

    return null;
};

const OriginalAdminComponent = FormBuilderBlock.AdminComponent;
FormBuilderBlock.AdminComponent = ({ ...props }) => {
    const fieldNames = props.state.blocks.filter(({ visible, props }) => visible && props.fieldName).map(({ props }) => props.fieldName);

    return (
        <FieldNamesContext.Provider value={fieldNames}>
            <HiddenInSubroute>
                <DuplicateFieldNamesWarning />
            </HiddenInSubroute>
            <OriginalAdminComponent {...props} />
        </FieldNamesContext.Provider>
    );
};
