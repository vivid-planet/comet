import { Tab, Tabs } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { storyRouterDecorator } from "../../../../story-router.decorator";

storiesOf("stories/components/Tabs/Tabs", module)
    .addDecorator(storyRouterDecorator())
    .add("Tabs", () => {
        return (
            <Tabs>
                <Tab label="Label One">Content One</Tab>
                <Tab label="Label Two">Content Two</Tab>
                <Tab label="Label Three">Content Three</Tab>
            </Tabs>
        );
    });
