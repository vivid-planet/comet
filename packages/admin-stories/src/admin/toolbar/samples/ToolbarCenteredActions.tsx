import {
    MainContent,
    Stack,
    StackPage,
    StackSwitch,
    StackSwitchApiContext,
    Toolbar,
    ToolbarActions,
    ToolbarBackButton,
    ToolbarFillSpace,
    ToolbarTitleItem,
} from "@comet/admin";
import { Box, Button, Container, Typography } from "@material-ui/core";
import * as React from "react";

export const ToolbarCenteredActions = () => {
    return (
        <Stack topLevelTitle={"Automatic Title"} showBreadcrumbs={false} showBackButton={false}>
            <StackSwitch initialPage="automaticTitle">
                <StackPage name={"automaticTitle"}>
                    <>
                        <Toolbar>
                            <ToolbarBackButton />

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
                                                <Typography>Details</Typography>
                                            </Button>
                                        </>
                                    )}
                                </StackSwitchApiContext.Consumer>
                            </ToolbarActions>
                            <ToolbarFillSpace />
                            <ToolbarTitleItem />
                        </Toolbar>

                        <MainContent>
                            <Container>
                                <Box>Automatic Title loaded from topLevelTitle Prop from Stack</Box>
                            </Container>
                        </MainContent>
                    </>
                </StackPage>
                <StackPage name={"automaticTitleDetail"} title={"Automatic Title Detail"}>
                    <>
                        <Toolbar>
                            <ToolbarBackButton />
                            <ToolbarFillSpace />
                            <ToolbarTitleItem />
                        </Toolbar>

                        <MainContent>
                            <Container>
                                <Box>Automatic Title loaded from Stack Page Title</Box>
                            </Container>
                        </MainContent>
                    </>
                </StackPage>
            </StackSwitch>
        </Stack>
    );
};
