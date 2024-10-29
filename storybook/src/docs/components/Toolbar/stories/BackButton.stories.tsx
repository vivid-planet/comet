import { StackSwitchApiContext, Toolbar, ToolbarActions, ToolbarAutomaticTitleItem, ToolbarBackButton, ToolbarFillSpace } from "@comet/admin";
import { Button, Typography } from "@mui/material";
import * as React from "react";

import { storyRouterDecorator } from "../../../../story-router.decorator";
import { toolbarDecorator } from "../toolbar.decorator";

export default {
    title: "stories/components/Toolbar/Back Button",
    decorators: [toolbarDecorator(), storyRouterDecorator()],
};

export const BackButton = () => {
    return (
        <Toolbar>
            <ToolbarBackButton />
            <ToolbarAutomaticTitleItem />
            <ToolbarFillSpace />
            <ToolbarActions>
                <StackSwitchApiContext.Consumer>
                    {(stackSwitchApi) => (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                stackSwitchApi?.activatePage("automaticTitleDetail", "details");
                            }}
                        >
                            <Typography>Go To Details</Typography>
                        </Button>
                    )}
                </StackSwitchApiContext.Consumer>
            </ToolbarActions>
        </Toolbar>
    );
};
