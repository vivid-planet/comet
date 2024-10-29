import { Toolbar, ToolbarAutomaticTitleItem, ToolbarItem } from "@comet/admin";
import { Typography } from "@mui/material";
import * as React from "react";

import { storyRouterDecorator } from "../../../../story-router.decorator";
import { toolbarDecorator } from "../toolbar.decorator";

export default {
    title: "stories/components/Toolbar/Toolbar Item",
    decorators: [toolbarDecorator(), storyRouterDecorator()],
};

export const _ToolbarItem = () => {
    return (
        <Toolbar>
            <ToolbarItem>
                <Typography>Item 1</Typography>
            </ToolbarItem>
            <ToolbarItem>
                <Typography>Item 2</Typography>
            </ToolbarItem>
            <ToolbarItem>
                <Typography>Item 3</Typography>
            </ToolbarItem>
        </Toolbar>
    );
};

export const ToolbarItemMixingWithOtherComponents = () => {
    return (
        <Toolbar>
            <ToolbarItem>
                <Typography>Item 1</Typography>
            </ToolbarItem>
            <ToolbarAutomaticTitleItem />
            <ToolbarItem>
                <Typography>Item 2</Typography>
            </ToolbarItem>
            <ToolbarItem>
                <Typography>Item 3</Typography>
            </ToolbarItem>
        </Toolbar>
    );
};

ToolbarItemMixingWithOtherComponents.storyName = "Toolbar Item mixing with other components";
