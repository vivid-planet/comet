import { Toolbar, ToolbarActions, ToolbarFillSpace, ToolbarItem } from "@comet/admin";
import { Button, Grid, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { storyRouterDecorator } from "../../../../story-router.decorator";
import { toolbarDecorator } from "../toolbar.decorator";

storiesOf("stories/components/Toolbar/Fill Space", module)
    .addDecorator(toolbarDecorator())
    .addDecorator(storyRouterDecorator())
    .add("Fill Space left", () => {
        return (
            <Toolbar>
                <ToolbarFillSpace />
                <ToolbarItem>
                    <Typography>Item</Typography>
                </ToolbarItem>
            </Toolbar>
        );
    })
    .add("Fill Space right", () => {
        return (
            <Toolbar>
                <ToolbarFillSpace />
                <ToolbarItem>
                    <Typography>Item</Typography>
                </ToolbarItem>
                <ToolbarFillSpace />
            </Toolbar>
        );
    })
    .add("Fill Space middle", () => {
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
    })
    .add("Fill Space middle 2", () => {
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
                                color={"primary"}
                                variant={"contained"}
                                onClick={() => {
                                    alert("clicked Action 1");
                                }}
                            >
                                Action 1
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                color={"secondary"}
                                variant={"contained"}
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
    });
