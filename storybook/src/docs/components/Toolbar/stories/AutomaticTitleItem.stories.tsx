import { Toolbar, ToolbarAutomaticTitleItem } from "@comet/admin";
import * as React from "react";

import { storyRouterDecorator } from "../../../../story-router.decorator";
import { toolbarDecorator } from "../toolbar.decorator";

export default {
    title: "stories/components/Toolbar/Automatic Title Item",
    decorators: [toolbarDecorator(), storyRouterDecorator()],
};

export const AutomaticTitleItem = () => {
    return (
        <Toolbar>
            <ToolbarAutomaticTitleItem />
        </Toolbar>
    );
};
