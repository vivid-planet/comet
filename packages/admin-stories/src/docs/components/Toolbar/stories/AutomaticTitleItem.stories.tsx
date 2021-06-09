import { Toolbar, ToolbarAutomaticTitleItem } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import StoryRouter from "storybook-react-router";

import { toolbarDecorator } from "../toolbar.decorator";

storiesOf("stories/components/Toolbar/Automatic Title Item", module)
    .addDecorator(toolbarDecorator())
    .addDecorator(StoryRouter())
    .add("Automatic Title Item", () => {
        return (
            <Toolbar>
                <ToolbarAutomaticTitleItem />
            </Toolbar>
        );
    });
