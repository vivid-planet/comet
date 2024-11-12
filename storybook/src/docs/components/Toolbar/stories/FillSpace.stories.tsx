import { Toolbar, ToolbarActions, ToolbarFillSpace, ToolbarItem } from "@comet/admin";
import { Button, Grid, Typography } from "@mui/material";
import * as React from "react";

import { storyRouterDecorator } from "../../../../story-router.decorator";
import { toolbarDecorator } from "../toolbar.decorator";

export default {
    title: "stories/components/Toolbar/Fill Space",
    decorators: [toolbarDecorator(), storyRouterDecorator()],
};

export const FillSpaceLeft = {
    render: () => {
        return (
            <Toolbar>
                <ToolbarFillSpace />
                <ToolbarItem>
                    <Typography>Item</Typography>
                </ToolbarItem>
            </Toolbar>
        );
    },

    name: "Fill Space left",
};

export const FillSpaceRight = {
    render: () => {
        return (
            <Toolbar>
                <ToolbarFillSpace />
                <ToolbarItem>
                    <Typography>Item</Typography>
                </ToolbarItem>
                <ToolbarFillSpace />
            </Toolbar>
        );
    },

    name: "Fill Space right",
};

export const FillSpaceMiddle = {
    render: () => {
        return (
            <Toolbar>
                <ToolbarItem>
                    <Typography>Item</Typography>
                </ToolbarItem>
                <ToolbarFillSpace />
                <ToolbarItem>
                    <Typography>Item</Typography>
                </ToolbarItem>
            </Toolbar>
        );
    },

    name: "Fill Space middle",
};

export const FillSpaceMiddle2 = {
    render: () => {
        return (
            <Toolbar>
                <ToolbarItem>
                    <Typography>Item</Typography>
                </ToolbarItem>
                <ToolbarFillSpace />
                <ToolbarActions>
                    <Grid container spacing={4}>
                        <Grid item>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => {
                                    alert("clicked Action 1");
                                }}
                            >
                                Action 1
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                color="secondary"
                                variant="contained"
                                onClick={() => {
                                    alert("clicked Action 2");
                                }}
                            >
                                Action 2
                            </Button>
                        </Grid>
                    </Grid>
                </ToolbarActions>
                <ToolbarFillSpace />
                <ToolbarItem>
                    <Typography>Item</Typography>
                </ToolbarItem>
            </Toolbar>
        );
    },

    name: "Fill Space middle 2",
};
