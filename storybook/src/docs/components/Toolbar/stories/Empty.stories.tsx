import { Toolbar } from "@comet/admin";
import * as React from "react";

import { storyRouterDecorator } from "../../../../story-router.decorator";
import { toolbarDecorator } from "../toolbar.decorator";

export default {
    title: "stories/components/Toolbar/Empty",
    decorators: [toolbarDecorator(), storyRouterDecorator()],
};

export const Empty = () => {
    return <Toolbar />;
};
