import { RouterTab, RouterTabs, Tab, Tabs } from "@comet/admin";
import { Menu, MenuItem, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { storyRouterDecorator } from "../../story-router.decorator";

export const DynamicRouterTabs = () => {
    const content = ["Two", "Three"];

    return (
        <RouterTabs>
            <RouterTab label="One" path="">
                One
            </RouterTab>
            {content.map((value) => (
                <RouterTab key={value} label={value} path={`/${value}`}>
                    {value}
                </RouterTab>
            ))}
        </RouterTabs>
    );
};

export const DynamicTabs = () => {
    const content = ["Two", "Three"];

    return (
        <Tabs>
            <Tab label="One">One</Tab>
            {content.map((value) => (
                <Tab key={value} label={value}>
                    {value}
                </Tab>
            ))}
        </Tabs>
    );
};

export const DynamicMenu = () => {
    const content = ["Two", "Three"];

    return (
        <Menu open={true}>
            <MenuItem>One</MenuItem>
            {content.map((value) => (
                <MenuItem key={value}>{value}</MenuItem>
            ))}
        </Menu>
    );
};

function Story() {
    return (
        <>
            <Typography variant="h2">Tabs:</Typography>
            <DynamicTabs />

            <Typography py={4} variant="h2">
                RouterTabs:
            </Typography>
            <DynamicRouterTabs />
        </>
    );
}

storiesOf("@comet/admin/tabs", module)
    .addDecorator(storyRouterDecorator())
    .add("Dynamic Tabs and RouterTabs", () => <Story />);
