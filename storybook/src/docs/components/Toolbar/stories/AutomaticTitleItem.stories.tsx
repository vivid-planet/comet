import { Toolbar, ToolbarAutomaticTitleItem } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { storyRouterDecorator } from "../../../../story-router.decorator";
import { toolbarDecorator } from "../toolbar.decorator";

storiesOf("stories/components/Toolbar/Automatic Title Item", module)
    .addDecorator(toolbarDecorator())
    .addDecorator(storyRouterDecorator())
    .add("Automatic Title Item", () => {
        return (
            <Toolbar>
                <ToolbarAutomaticTitleItem />
            </Toolbar>
        );
    });
