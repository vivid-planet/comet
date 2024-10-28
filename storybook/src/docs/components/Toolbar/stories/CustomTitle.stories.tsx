import { Toolbar, ToolbarItem } from "@comet/admin";
import { CometColor } from "@comet/admin-icons";
import { Typography } from "@mui/material";
import * as React from "react";

import { storyRouterDecorator } from "../../../../story-router.decorator";
import { toolbarDecorator } from "../toolbar.decorator";

export default {
    title: "stories/components/Toolbar/Custom Title",
    decorators: [toolbarDecorator(), storyRouterDecorator()],
};

export const CustomTitleH1 = () => {
    return (
        <Toolbar>
            <ToolbarItem>
                <Typography variant="h1">Custom Title H1</Typography>
            </ToolbarItem>
        </Toolbar>
    );
};

CustomTitleH1.storyName = "Custom Title H1";

export const CustomTitleH2 = () => {
    return (
        <Toolbar>
            <ToolbarItem>
                <>
                    <CometColor fontSize="large" />
                    <Typography variant="h2">Custom Title H2</Typography>
                </>
            </ToolbarItem>
        </Toolbar>
    );
};

CustomTitleH2.storyName = "Custom Title H2";

export const CustomTitleH3 = () => {
    return (
        <Toolbar>
            <div style={{ display: "flex", backgroundColor: "black", alignItems: "center", paddingLeft: 20, paddingRight: 20 }}>
                <Typography variant="h3" color="primary">
                    Custom Title H3
                </Typography>
            </div>
        </Toolbar>
    );
};

CustomTitleH3.storyName = "Custom Title H3";

export const CustomTitleH4 = () => {
    return (
        <Toolbar>
            <ToolbarItem>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="h4">Multi Line - Custom Title H4</Typography>
                    <Typography variant="h4">Multi Line - Custom Title H4</Typography>
                    <Typography variant="h4">Multi Line - Custom Title H4</Typography>
                </div>
            </ToolbarItem>
        </Toolbar>
    );
};

CustomTitleH4.storyName = "Custom Title H4";
