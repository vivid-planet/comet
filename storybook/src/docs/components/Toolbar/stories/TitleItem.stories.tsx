import { Toolbar, ToolbarTitleItem } from "@comet/admin";
import * as React from "react";

import { storyRouterDecorator } from "../../../../story-router.decorator";
import { toolbarDecorator } from "../toolbar.decorator";

export default {
    title: "stories/components/Toolbar/Title Item",
    decorators: [toolbarDecorator(), storyRouterDecorator()],
};

export const TitleItem = () => {
    return (
        <Toolbar>
            <ToolbarTitleItem>Toolbar Title Item</ToolbarTitleItem>
        </Toolbar>
    );
};
