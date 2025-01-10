import { SwitchField, TextField } from "@comet/admin";
import { BlocksFinalForm, createCompositeSetting } from "@comet/blocks-admin";
import { FormattedMessage } from "react-intl";

export const propsAndValidationGroup = {
    title: <FormattedMessage id="blocks.commonFormField.propsAndValidation" defaultMessage="Props and Validation" />,
    paper: true,
    blocks: {
        fieldName: {
            block: createCompositeSetting<string>({
                defaultValue: "",
                AdminComponent: ({ state, updateState }) => (
                    <BlocksFinalForm<{ value: typeof state }>
                        onSubmit={({ value }) => updateState(value ? value.toLowerCase().replace(/[^a-z0-9]/g, "-") : "")}
                        initialValues={{ value: state || undefined }}
                    >
                        <TextField
                            name="value"
                            label={<FormattedMessage id="blocks.commonFormField.fieldName" defaultMessage="Field Name" />}
                            fullWidth
                        />
                    </BlocksFinalForm>
                ),
            }),
            hiddenInSubroute: true,
        },
        mandatory: {
            // TODO: Use helper function once merged: https://github.com/vivid-planet/comet/pull/3052
            block: createCompositeSetting<boolean>({
                defaultValue: false,
                AdminComponent: ({ state, updateState }) => (
                    <BlocksFinalForm<{ value: typeof state }> onSubmit={({ value }) => updateState(value)} initialValues={{ value: state }}>
                        <SwitchField
                            name="value"
                            label={<FormattedMessage id="blocks.commonFormField.mandatory" defaultMessage="Mandatory" />}
                            fullWidth
                        />
                    </BlocksFinalForm>
                ),
            }),
            hiddenInSubroute: true,
        },
    },
};
