import { Toolbar, ToolbarTitleItem } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import StoryRouter from "storybook-react-router";

import { toolbarDecorator } from "../toolbar.decorator";

storiesOf("stories/components/Toolbar/Title Item", module)
    .addDecorator(toolbarDecorator())
    .addDecorator(StoryRouter())
    .add("Title Item", () => {
        return (
            <Toolbar>
                <ToolbarTitleItem>Toolbar Title Item</ToolbarTitleItem>
            </Toolbar>
        );
    });
