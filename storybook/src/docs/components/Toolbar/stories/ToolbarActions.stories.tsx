import { Toolbar, ToolbarActions, ToolbarAutomaticTitleItem, ToolbarFillSpace } from "@comet/admin";
import { Button, Grid } from "@mui/material";
import * as React from "react";

import { storyRouterDecorator } from "../../../../story-router.decorator";
import { toolbarDecorator } from "../toolbar.decorator";

export default {
    title: "stories/components/Toolbar/Toolbar Actions",
    decorators: [toolbarDecorator(), storyRouterDecorator()],
};

export const ToolbarActionsOneAction = {
    render: () => {
        return (
            <Toolbar>
                <ToolbarAutomaticTitleItem />
                <ToolbarFillSpace />
                <ToolbarActions>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {
                            alert("clicked Action");
                        }}
                    >
                        Action
                    </Button>
                </ToolbarActions>
            </Toolbar>
        );
    },

    name: "Toolbar Actions one action",
};

export const ToolbarActionsTwoActions = {
    render: () => {
        return (
            <Toolbar>
                <ToolbarAutomaticTitleItem />
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
            </Toolbar>
        );
    },

    name: "Toolbar Actions two actions",
};
