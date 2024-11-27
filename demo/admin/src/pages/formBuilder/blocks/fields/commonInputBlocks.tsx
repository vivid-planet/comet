// TODO: Move to comet
// TODO: Gerneric formatted messages

import { SwitchField, TextField } from "@comet/admin";
import { BlocksFinalForm, createCompositeSettings } from "@comet/blocks-admin";
import { FormattedMessage } from "react-intl";

type SettingsFormValues = {
    label: string;
    name: string;
    required: boolean;
};

// TODO: Implement slug-like logic for `name`, similar to file-name in DAM
export const commonInputBlocks = {
    $settings: {
        block: createCompositeSettings<SettingsFormValues>({
            defaultValues: {
                label: "",
                name: "",
                required: false,
            },
            AdminComponent: ({ state, updateState }) => {
                return (
                    <BlocksFinalForm<SettingsFormValues>
                        onSubmit={(state) => updateState({ ...state, name: state.label.toLowerCase().replace(/[^a-z0-9]/g, "-") })}
                        initialValues={state}
                    >
                        <TextField name="label" label={<FormattedMessage id="blocks.textInput.label" defaultMessage="Label" />} fullWidth />
                        <TextField name="name" label={<FormattedMessage id="blocks.textInput.name" defaultMessage="Name" />} disabled fullWidth />
                        <SwitchField
                            name="required"
                            label={<FormattedMessage id="blocks.textInput.required" defaultMessage="Required" />}
                            fullWidth
                        />
                    </BlocksFinalForm>
                );
            },
        }),
        hiddenInSubroute: true,
    },
};
