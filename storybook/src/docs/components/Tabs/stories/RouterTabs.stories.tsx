import { RouterTab, RouterTabs } from "@comet/admin";
import * as React from "react";
import { useLocation } from "react-router";

import { storyRouterDecorator } from "../../../../story-router.decorator";

export default {
    title: "stories/components/Tabs/RouterTabs",
    decorators: [storyRouterDecorator()],
};

export const _RouterTabs = {
    render: () => {
        const location = useLocation();

        return (
            <div>
                <p>Location: {location.pathname}</p>
                <RouterTabs>
                    <RouterTab path="" label="Label One">
                        Content One
                    </RouterTab>
                    <RouterTab path="/tab2" label="Label Two">
                        Content Two
                    </RouterTab>
                    <RouterTab path="/tab3" label="Label Three">
                        Content Three
                    </RouterTab>
                </RouterTabs>
            </div>
        );
    },

    name: "RouterTabs",
};
