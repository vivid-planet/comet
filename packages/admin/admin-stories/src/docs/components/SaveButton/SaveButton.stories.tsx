import { SaveButton } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { FormattedMessage } from "react-intl";

storiesOf("stories/components/Save Button", module).add("SaveButton", () => {
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
});
