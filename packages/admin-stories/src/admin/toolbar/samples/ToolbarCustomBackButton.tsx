import { IStackSwitchApi, MainContent, Stack, StackPage, StackSwitch, Toolbar, ToolbarItem, ToolbarTitleItem, useStackApi } from "@comet/admin";
import { ArrowRight, ChevronLeft } from "@comet/admin-icons";
import { Box, Button, Container, IconButton, Typography } from "@material-ui/core";
import * as React from "react";

const CustomToolbarBackButton = () => {
    const stackApi = useStackApi();

    return stackApi && stackApi.breadCrumbs.length > 1 ? (
        <ToolbarItem>
            <IconButton
                color={"primary"}
                onClick={() => {
                    stackApi.goBack?.();
                }}
            >
                <ChevronLeft />
                <Typography>Back</Typography>
            </IconButton>
        </ToolbarItem>
    ) : null;
};

export const ToolbarCustomBackButton = () => {
    return (
        <Stack topLevelTitle={"Custom Back Button"} showBreadcrumbs={false} showBackButton={false}>
            <StackSwitch initialPage="root">
                <StackPage name={"root"}>
                    <>
                        <Toolbar
                            actionItems={(stackSwitchApi: IStackSwitchApi | undefined) => {
                                return (
                                    <>
                                        <Button
                                            variant={"contained"}
                                            color={"primary"}
                                            onClick={() => {
                                                stackSwitchApi?.activatePage("details", "foo");
                                            }}
                                            endIcon={<ArrowRight />}
                                        >
                                            <Typography>Details</Typography>
                                        </Button>
                                    </>
                                );
                            }}
                        >
                            <ToolbarTitleItem />
                        </Toolbar>

                        <MainContent>
                            <Container>
                                <Box>
                                    <Typography>Content</Typography>
                                </Box>
                            </Container>
                        </MainContent>
                    </>
                </StackPage>
                <StackPage name={"details"} title={"Details"}>
                    <>
                        <Toolbar>
                            <CustomToolbarBackButton />

                            <ToolbarTitleItem />
                        </Toolbar>
                        <MainContent>
                            <Container>
                                <Box>
                                    <Typography>Content</Typography>
                                </Box>
                            </Container>
                        </MainContent>
                    </>
                </StackPage>
            </StackSwitch>
        </Stack>
    );
};
