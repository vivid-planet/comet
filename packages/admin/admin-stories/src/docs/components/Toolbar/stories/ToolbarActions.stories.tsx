import { Toolbar, ToolbarActions, ToolbarAutomaticTitleItem, ToolbarFillSpace } from "@comet/admin";
import { Button, Grid } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { storyRouterDecorator } from "../../../../story-router.decorator";
import { toolbarDecorator } from "../toolbar.decorator";

storiesOf("stories/components/Toolbar/Toolbar Actions", module)
    .addDecorator(toolbarDecorator())
    .addDecorator(storyRouterDecorator())
    .add("Toolbar Actions one action", () => {
        return (
            <Toolbar>
                <ToolbarAutomaticTitleItem />
                <ToolbarFillSpace />
                <ToolbarActions>
                    <Button
                        color={"primary"}
                        variant={"contained"}
                        onClick={() => {
                            alert("clicked Action");
                        }}
                    >
                        Action
                    </Button>
                </ToolbarActions>
            </Toolbar>
        );
    })
    .add("Toolbar Actions two actions", () => {
        return (
            <Toolbar>
                <ToolbarAutomaticTitleItem />
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
            </Toolbar>
        );
    });
