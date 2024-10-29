import { Tab, Tabs } from "@comet/admin";
import * as React from "react";

import { storyRouterDecorator } from "../../../../story-router.decorator";

export default {
    title: "stories/components/Tabs/Tabs",
    decorators: [storyRouterDecorator()],
};

export const _Tabs = () => {
    return (
        <Tabs>
            <Tab label="Label One">Content One</Tab>
            <Tab label="Label Two">Content Two</Tab>
            <Tab label="Label Three">Content Three</Tab>
        </Tabs>
    );
};
