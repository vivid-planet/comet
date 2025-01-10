import { SaveButton } from "@comet/admin";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

export default {
    title: "Docs/Components/SaveButton",
};

export const Basic = {
    render: () => {
        const [saving, setSaving] = useState(false);
        return (
            <SaveButton
                saving={saving}
                onClick={() => {
                    setSaving(true);
                    setTimeout(() => {
                        setSaving(false);
                    }, 1000);
                }}
            >
                <FormattedMessage id="comet.save" defaultMessage="Save" />
            </SaveButton>
        );
    },

    name: "SaveButton",
};
