import { IStackSwitchApi, MainContent, Stack, StackPage, StackSwitch, Toolbar, ToolbarBackButton, ToolbarTitleItem } from "@comet/admin";
import { Box, Button, Checkbox, Container, Typography } from "@material-ui/core";
import * as React from "react";

export const ToolbarShowHideTitle = () => {
    const [showTitle, setShowTitle] = React.useState(false);
    return (
        <Stack topLevelTitle={"Show/Hide Title Example"} showBreadcrumbs={false} showBackButton={false}>
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
                                        >
                                            <Typography>Details</Typography>
                                        </Button>
                                    </>
                                );
                            }}
                        >
                            <ToolbarBackButton />
                            {showTitle && <ToolbarTitleItem />}
                        </Toolbar>

                        <MainContent>
                            <Container>
                                <Box>
                                    <Typography>
                                        <Checkbox
                                            checked={showTitle}
                                            onChange={(event) => {
                                                setShowTitle(event.target.checked);
                                            }}
                                        />
                                        Show Title
                                    </Typography>
                                </Box>
                            </Container>
                        </MainContent>
                    </>
                </StackPage>
                <StackPage name={"details"} title={"Show Hide Title - Details"}>
                    <>
                        <Toolbar>
                            <ToolbarBackButton />
                            {showTitle && <ToolbarTitleItem />}
                        </Toolbar>
                        <MainContent>
                            <Container>
                                <Box>
                                    <Typography>
                                        <Checkbox
                                            checked={showTitle}
                                            onChange={(event) => {
                                                setShowTitle(event.target.checked);
                                            }}
                                        />
                                        Show Title
                                    </Typography>
                                </Box>
                            </Container>
                        </MainContent>
                    </>
                </StackPage>
            </StackSwitch>
        </Stack>
    );
};
