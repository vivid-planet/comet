import { SaveButton, SplitButton } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { FormattedMessage } from "react-intl";

storiesOf("stories/components/Save Button", module).add("Save / Save and go Back Button", () => {
    const [saving, setSaving] = React.useState(false);
    return (
        <SplitButton localStorageKey="Page1.SaveSplitButton" variant="contained" color="primary">
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
            <SaveButton
                saving={saving}
                onClick={() => {
                    setSaving(true);
                    setTimeout(() => {
                        setSaving(false);
                    }, 1000);
                }}
            >
                <FormattedMessage id="comet.saveAndGoBack" defaultMessage="Save and Go Back" />
            </SaveButton>
        </SplitButton>
    );
});
