import { Toolbar } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { storyRouterDecorator } from "../../../../story-router.decorator";
import { toolbarDecorator } from "../toolbar.decorator";

storiesOf("stories/components/Toolbar/Empty", module)
    .addDecorator(toolbarDecorator())
    .addDecorator(storyRouterDecorator())
    .add("Empty", () => {
        return <Toolbar />;
    });
