import { Toolbar, ToolbarTitleItem } from "@comet/admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { storyRouterDecorator } from "../../../../story-router.decorator";
import { toolbarDecorator } from "../toolbar.decorator";

export default {
    title: "stories/components/Toolbar/Localized Title Item",
    decorators: [toolbarDecorator(), storyRouterDecorator()],
};

export const LocalizedTitleItem = () => {
    return (
        <Toolbar>
            <ToolbarTitleItem>
                <FormattedMessage id="storybook.toolbartitleitem.title" defaultMessage="Localized Title" />
            </ToolbarTitleItem>
        </Toolbar>
    );
};
