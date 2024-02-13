import { Toolbar, ToolbarTitleItem } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { storyRouterDecorator } from "../../../../story-router.decorator";
import { toolbarDecorator } from "../toolbar.decorator";

storiesOf("stories/components/Toolbar/Localized Title Item", module)
    .addDecorator(toolbarDecorator())
    .addDecorator(storyRouterDecorator())
    .add("Localized Title Item", () => {
        return (
            <Toolbar>
                <ToolbarTitleItem>
                    <FormattedMessage id="storybook.toolbartitleitem.title" defaultMessage="Localized Title" />
                </ToolbarTitleItem>
            </Toolbar>
        );
    });
