import { IStackSwitchApi, MainContent, Stack, StackPage, StackSwitch, Toolbar, ToolbarBackButton, ToolbarTitleItem } from "@comet/admin";
import { Box, Button, Container, Typography } from "@material-ui/core";
import * as React from "react";

export const ToolbarAutomaticTitle = () => {
    return (
        <Stack topLevelTitle={"Automatic Title"} showBreadcrumbs={false} showBackButton={false}>
            <StackSwitch initialPage="automaticTitle">
                <StackPage name={"automaticTitle"}>
                    <>
                        <Toolbar
                            actionItems={(stackSwitchApi: IStackSwitchApi | undefined) => {
                                return (
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
                                );
                            }}
                        >
                            <ToolbarBackButton />
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
