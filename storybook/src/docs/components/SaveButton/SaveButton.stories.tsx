import { SaveButton } from "@comet/admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

export default {
    title: "stories/components/Save Button",
};

export const _SaveButton = () => {
    const [saving, setSaving] = React.useState(false);
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
};

_SaveButton.storyName = "SaveButton";
