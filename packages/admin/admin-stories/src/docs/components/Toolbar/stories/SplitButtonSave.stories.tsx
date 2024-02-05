import { SaveButton, SplitButton, Toolbar, ToolbarActions, ToolbarFillSpace, ToolbarTitleItem } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { storyRouterDecorator } from "../../../../story-router.decorator";
import { toolbarDecorator } from "../toolbar.decorator";

storiesOf("stories/components/Toolbar/Save Split Button", module)
    .addDecorator(toolbarDecorator())
    .addDecorator(storyRouterDecorator())
    .add("Save Split Button", () => {
        const [saving, setSaving] = React.useState(false);
        return (
            <Toolbar>
                <ToolbarTitleItem>Save Split Button</ToolbarTitleItem>
                <ToolbarFillSpace />
                <ToolbarActions>
                    <SplitButton localStorageKey="Page5.SaveSplitButton" color="primary" variant="contained">
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
                </ToolbarActions>
            </Toolbar>
        );
    });
