import { Divider, Tab, Tabs } from "@comet/admin";
import { Account, Domain } from "@comet/admin-icons";
import { Favorite, HelpOutline } from "@mui/icons-material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { storyRouterDecorator } from "../../../../story-router.decorator";

storiesOf("stories/components/Tabs/Tabs", module)
    .addDecorator(storyRouterDecorator())
    .add("Tabs", () => {
        return (
            <Tabs>
                <Tab label="Label One">Content One</Tab>
                <Tab label="Label Two" status="success" disabled>
                    Content Two
                </Tab>
                <Tab label="Label Three" status="error" showStatusIcon showTooltip tooltipMessage="Tooltip message">
                    Content Three
                </Tab>
                <Divider />
                <Tab label="Label Four" status="error" tabIcon={<Account />} statusIcon={<Favorite />} showStatusIcon>
                    Content Four
                </Tab>
                <Tab
                    label="Label Five"
                    tabIcon={<Domain />}
                    status="warning"
                    showStatusIcon
                    showTooltip
                    tooltipMessage="Tooltip message"
                    tooltipIcon={<HelpOutline fontSize="large" />}
                >
                    Content Five
                </Tab>
            </Tabs>
        );
    });
