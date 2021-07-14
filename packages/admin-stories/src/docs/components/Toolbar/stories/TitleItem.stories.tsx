import { Toolbar, ToolbarTitleItem } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { storyRouterDecorator } from "../../../../story-router.decorator";
import { toolbarDecorator } from "../toolbar.decorator";

storiesOf("stories/components/Toolbar/Title Item", module)
    .addDecorator(toolbarDecorator())
    .addDecorator(storyRouterDecorator())
    .add("Title Item", () => {
        return (
            <Toolbar>
                <ToolbarTitleItem>Toolbar Title Item</ToolbarTitleItem>
            </Toolbar>
        );
    });
