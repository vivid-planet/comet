import { StackApiContext, StackSwitchApiContext, Toolbar, ToolbarActions, ToolbarFillSpace, ToolbarItem } from "@comet/admin";
import { ChevronLeft } from "@comet/admin-icons";
import { Button, IconButton, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { storyRouterDecorator } from "../../../../story-router.decorator";
import { toolbarDecorator } from "../toolbar.decorator";

storiesOf("stories/components/Toolbar/Custom Back Button", module)
    .addDecorator(toolbarDecorator())
    .addDecorator(storyRouterDecorator())
    .add("Custom Back Button", () => {
        return (
            <StackApiContext.Consumer>
                {(stackApi) => (
                    <Toolbar>
                        {stackApi && stackApi.breadCrumbs.length > 1 && (
                            <ToolbarItem>
                                <IconButton
                                    color={"primary"}
                                    onClick={() => {
                                        stackApi.goBack?.();
                                    }}
                                    size="large"
                                >
                                    <ChevronLeft fontSize={"large"} />
                                    <Typography>Back</Typography>
                                </IconButton>
                            </ToolbarItem>
                        )}
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
                )}
            </StackApiContext.Consumer>
        );
    });
