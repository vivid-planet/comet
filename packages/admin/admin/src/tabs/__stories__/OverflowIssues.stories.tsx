import { MainContent, RouterTab, RouterTabs, Toolbar, ToolbarAutomaticTitleItem } from "@comet/admin";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import type { Meta } from "@storybook/react-vite";
import { useState } from "react";

import { MasterLayoutDecorator } from "../../../.storybook/decorators/MasterLayout.decorator";

const storyConfig: Meta = {
    title: "components/tabs/Overflow Issues",
    parameters: {
        docs: {
            description: {
                component:
                    "This story is for debugging an issue where using certain content inside MasterLayout causes the content to overflow the page.",
            },
        },
    },
};

export default storyConfig;

const numberOfTabs = 20;

const ExampleContentBlock = () => {
    return (
        <Box
            sx={(theme) => ({
                width: 200,
                height: "150vh",
                borderRadius: theme.shape.borderRadius,
                backgroundColor: theme.palette.grey[100],
            })}
        />
    );
};

export const RouterTabsInMasterContent = {
    decorators: [MasterLayoutDecorator],
    parameters: {
        layout: "none",
        stack: { topLevelTitle: "Example Page" },
    },
    render: () => {
        return (
            <MainContent>
                <RouterTabs>
                    {Array.from({ length: numberOfTabs }, (_, index) => (
                        <RouterTab key={index} path={index === 0 ? "" : `/lorem-ipsum-${index + 1}`} label={`Lorem ipsum ${index + 1}`}>
                            <Typography variant="h2" gutterBottom>
                                Lorem ipsum {index + 1}
                            </Typography>
                            <ExampleContentBlock />
                        </RouterTab>
                    ))}
                </RouterTabs>
            </MainContent>
        );
    },
};

export const RouterTabsInMasterContentWithToolbar = {
    decorators: [MasterLayoutDecorator],
    parameters: {
        layout: "none",
        stack: { topLevelTitle: "Example Page" },
    },
    render: () => {
        return (
            <>
                <Toolbar>
                    <ToolbarAutomaticTitleItem />
                </Toolbar>
                <MainContent>
                    <RouterTabs>
                        {Array.from({ length: numberOfTabs }, (_, index) => (
                            <RouterTab key={index} path={index === 0 ? "" : `/lorem-ipsum-${index + 1}`} label={`Lorem ipsum ${index + 1}`}>
                                <Typography variant="h2" gutterBottom>
                                    Lorem ipsum {index + 1}
                                </Typography>
                                <ExampleContentBlock />
                            </RouterTab>
                        ))}
                    </RouterTabs>
                </MainContent>
            </>
        );
    },
};

export const MuiTabsInMasterContent = {
    decorators: [MasterLayoutDecorator],
    parameters: {
        layout: "none",
        stack: { topLevelTitle: "Example Page" },
    },
    render: () => {
        const [activeTabIndex, setActiveTabIndex] = useState(0);

        return (
            <MainContent>
                <Tabs variant="scrollable" value={activeTabIndex} onChange={(_, index) => setActiveTabIndex(index)}>
                    {Array.from({ length: numberOfTabs }, (_, index) => (
                        <Tab key={index} label={`Lorem ipsum ${index + 1}`} />
                    ))}
                </Tabs>
                <ExampleContentBlock />
            </MainContent>
        );
    },
};

export const MuiTabsInMasterContentWithToolbar = {
    decorators: [MasterLayoutDecorator],
    parameters: {
        layout: "none",
        stack: { topLevelTitle: "Example Page" },
    },
    render: () => {
        const [activeTabIndex, setActiveTabIndex] = useState(0);

        return (
            <>
                <Toolbar>
                    <ToolbarAutomaticTitleItem />
                </Toolbar>
                <MainContent>
                    <Tabs variant="scrollable" value={activeTabIndex} onChange={(_, index) => setActiveTabIndex(index)}>
                        {Array.from({ length: numberOfTabs }, (_, index) => (
                            <Tab key={index} label={`Lorem ipsum ${index + 1}`} />
                        ))}
                    </Tabs>
                    <ExampleContentBlock />
                </MainContent>
            </>
        );
    },
};

export const RouterTabsInMainContent = {
    parameters: {
        layout: "none",
        stack: { topLevelTitle: "Example Page" },
    },
    render: () => {
        return (
            <MainContent>
                <RouterTabs>
                    {Array.from({ length: numberOfTabs }, (_, index) => (
                        <RouterTab key={index} path={index === 0 ? "" : `/lorem-ipsum-${index + 1}`} label={`Lorem ipsum ${index + 1}`}>
                            <Typography variant="h2" gutterBottom>
                                Lorem ipsum {index + 1}
                            </Typography>
                            <ExampleContentBlock />
                        </RouterTab>
                    ))}
                </RouterTabs>
            </MainContent>
        );
    },
};

export const MuiTabsInMainContent = {
    parameters: {
        layout: "none",
    },
    render: () => {
        const [activeTabIndex, setActiveTabIndex] = useState(0);

        return (
            <MainContent>
                <Tabs variant="scrollable" value={activeTabIndex} onChange={(_, index) => setActiveTabIndex(index)}>
                    {Array.from({ length: numberOfTabs }, (_, index) => (
                        <Tab key={index} label={`Lorem ipsum ${index + 1}`} />
                    ))}
                </Tabs>
                <ExampleContentBlock />
            </MainContent>
        );
    },
};
