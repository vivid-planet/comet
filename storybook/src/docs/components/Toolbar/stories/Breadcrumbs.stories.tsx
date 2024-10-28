import { StackSwitchApiContext, Toolbar, ToolbarActions, ToolbarBackButton, ToolbarBreadcrumbs, ToolbarFillSpace } from "@comet/admin";
import { Button, Grid } from "@mui/material";
import * as React from "react";

import { storyRouterDecorator } from "../../../../story-router.decorator";
import { toolbarDecorator } from "../toolbar.decorator";

export default {
    title: "stories/components/Toolbar/Breadcrumbs",
    decorators: [toolbarDecorator(), storyRouterDecorator()],
};

export const Breadcrumbs = () => {
    return (
        <Toolbar>
            <ToolbarBackButton />
            <ToolbarBreadcrumbs />
            <ToolbarFillSpace />
            <ToolbarActions>
                <StackSwitchApiContext.Consumer>
                    {(stackSwitchApi) => (
                        <Grid container spacing={4}>
                            <Grid item>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={() => {
                                        stackSwitchApi.activatePage("page-1", "details");
                                    }}
                                >
                                    1
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={() => {
                                        stackSwitchApi.activatePage("page-2", "details");
                                    }}
                                >
                                    2
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                </StackSwitchApiContext.Consumer>
            </ToolbarActions>
        </Toolbar>
    );
};
