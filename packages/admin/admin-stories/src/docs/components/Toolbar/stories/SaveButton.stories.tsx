import { SaveButton, Toolbar, ToolbarActions, ToolbarFillSpace, ToolbarTitleItem } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { storyRouterDecorator } from "../../../../story-router.decorator";
import { toolbarDecorator } from "../toolbar.decorator";

storiesOf("stories/components/Toolbar/Save Button", module)
    .addDecorator(toolbarDecorator())
    .addDecorator(storyRouterDecorator())
    .add("Save", () => {
        const [saving, setSaving] = React.useState(false);
        return (
            <Toolbar>
                <ToolbarTitleItem>Save Button</ToolbarTitleItem>
                <ToolbarFillSpace />
                <ToolbarActions>
                    <SaveButton
                        color="primary"
                        variant="contained"
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
                </ToolbarActions>
            </Toolbar>
        );
    });
