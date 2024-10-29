import { SaveButton, Toolbar, ToolbarActions, ToolbarFillSpace, ToolbarTitleItem } from "@comet/admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { storyRouterDecorator } from "../../../../story-router.decorator";
import { toolbarDecorator } from "../toolbar.decorator";

export default {
    title: "stories/components/Toolbar/Save Button",
    decorators: [toolbarDecorator(), storyRouterDecorator()],
};

export const Save = () => {
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
};
