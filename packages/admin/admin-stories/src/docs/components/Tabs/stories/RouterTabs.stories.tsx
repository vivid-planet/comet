import { Divider, RouterTab, RouterTabs } from "@comet/admin";
import { Account, Domain } from "@comet/admin-icons";
import { Favorite, HelpOutline } from "@mui/icons-material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { useLocation } from "react-router";

import { storyRouterDecorator } from "../../../../story-router.decorator";

storiesOf("stories/components/Tabs/RouterTabs", module)
    .addDecorator(storyRouterDecorator())
    .add("RouterTabs", () => {
        const location = useLocation();

        return (
            <div>
                <p>Location: {location.pathname}</p>
                <RouterTabs>
                    <RouterTab path="" label="Label One">
                        Content One
                    </RouterTab>
                    <RouterTab path="/tab2" label="Label Two" status="success">
                        Content Two
                    </RouterTab>
                    <RouterTab path="/tab3" label="Label Three" status="error" showStatusIcon showTooltip tooltipMessage="Tooltip message">
                        Content Three
                    </RouterTab>
                    <Divider />
                    <RouterTab path="/tab4" label="Label Four" status="error" icon={<Account />} statusIcon={<Favorite />} showStatusIcon>
                        Content Four
                    </RouterTab>
                    <RouterTab
                        path="/tab5"
                        label="Label Five"
                        icon={<Domain />}
                        status="warning"
                        showStatusIcon
                        showTooltip
                        tooltipMessage="Tooltip message"
                        tooltipIcon={<HelpOutline fontSize="large" />}
                    >
                        Content Five
                    </RouterTab>
                </RouterTabs>
            </div>
        );
    });
