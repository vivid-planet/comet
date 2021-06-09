import { StackSwitchApiContext, Toolbar, ToolbarActions, ToolbarAutomaticTitleItem, ToolbarBackButton, ToolbarFillSpace } from "@comet/admin";
import { Button, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import StoryRouter from "storybook-react-router";

import { toolbarDecorator } from "../toolbar.decorator";

storiesOf("stories/components/Toolbar/Back Button", module)
    .addDecorator(toolbarDecorator())
    .addDecorator(StoryRouter())
    .add("Back Button", () => {
        return (
            <Toolbar>
                <ToolbarBackButton />
                <ToolbarAutomaticTitleItem />
                <ToolbarFillSpace />
                <ToolbarActions>
                    <StackSwitchApiContext.Consumer>
                        {(stackSwitchApi) => (
                            <>
                                <Button
                                    variant={"contained"}
                                    color={"primary"}
                                    onClick={() => {
                                        stackSwitchApi?.activatePage("automaticTitleDetail", "details");
                                    }}
                                >
                                    <Typography>Go To Details</Typography>
                                </Button>
                            </>
                        )}
                    </StackSwitchApiContext.Consumer>
                </ToolbarActions>
            </Toolbar>
        );
    });
