import {
    IStackApi,
    IStackSwitchApi,
    MainContent,
    Stack,
    StackApiContext,
    StackPage,
    StackPageTitle,
    StackSwitch,
    Toolbar,
    ToolbarBackButton,
    ToolbarBreadcrumbs,
    useStackSwitch,
} from "@comet/admin";
import { Box, Button, Container, Grid, Typography } from "@material-ui/core";
import { TreeItem, TreeView } from "@material-ui/lab";
import * as React from "react";

const BreadcrumbTree = () => {
    return (
        <TreeView expanded={["1", "2", "3", "4"]} defaultCollapseIcon={<div>-</div>} defaultExpandIcon={<div>-</div>} defaultEndIcon={<div>-</div>}>
            <TreeItem nodeId="1" label="Page1">
                <TreeItem nodeId="2" label="Page 2">
                    <TreeItem nodeId="2-1" label="Page 2-1" />
                    <TreeItem nodeId="2-2" label="Page 2-2" />
                </TreeItem>
                <TreeItem nodeId="3" label="Page 3">
                    <TreeItem nodeId="3-1" label="Page 3-1" />
                    <TreeItem nodeId="3-2" label="Page 3-2" />
                </TreeItem>
                <TreeItem nodeId={"4"} label={"Page 4"} />
            </TreeItem>
        </TreeView>
    );
};
const ToolbarBreadcrumb = () => {
    return (
        <StackApiContext.Consumer>
            {(stackApi: IStackApi | undefined) => <ToolbarBreadcrumbs pages={stackApi?.breadCrumbs ?? []} />}
        </StackApiContext.Consumer>
    );
};
const Page1 = () => {
    return (
        <>
            <Toolbar
                actionItems={(stackSwitchApi: IStackSwitchApi | undefined) => {
                    return (
                        <Grid container spacing={4}>
                            <Grid item>
                                <Button
                                    variant={"contained"}
                                    color={"primary"}
                                    onClick={() => {
                                        stackSwitchApi?.activatePage("page2", "foo");
                                    }}
                                >
                                    <Typography>Go to Page 2</Typography>
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant={"contained"}
                                    color={"primary"}
                                    onClick={() => {
                                        stackSwitchApi?.activatePage("page3", "foo");
                                    }}
                                >
                                    <Typography>Go to Page 3</Typography>
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant={"contained"}
                                    color={"primary"}
                                    onClick={() => {
                                        stackSwitchApi?.activatePage("page4", "foo");
                                    }}
                                >
                                    <Typography>Go to Page 4</Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    );
                }}
            >
                <ToolbarBackButton />
                <ToolbarBreadcrumb />
            </Toolbar>

            <MainContent>
                <Container>
                    <Typography variant={"h3"}>Page 1</Typography>

                    <Typography variant={"h6"}>Breadcrumb Tree</Typography>

                    <BreadcrumbTree />
                </Container>
            </MainContent>
        </>
    );
};

const Page2 = () => {
    return (
        <StackSwitch initialPage={"page2-0"}>
            <StackPage name="page2-0">
                <>
                    <Toolbar
                        actionItems={(stackSwitchApi: IStackSwitchApi | undefined) => {
                            return (
                                <Grid container spacing={4}>
                                    <Grid item>
                                        <Button
                                            variant={"contained"}
                                            color={"primary"}
                                            onClick={() => {
                                                stackSwitchApi?.activatePage("page2-1", "foo");
                                            }}
                                        >
                                            <Typography>Page 2-1</Typography>
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant={"contained"}
                                            color={"primary"}
                                            onClick={() => {
                                                stackSwitchApi?.activatePage("page2-2", "foo");
                                            }}
                                        >
                                            <Typography>Page 2-2</Typography>
                                        </Button>
                                    </Grid>
                                </Grid>
                            );
                        }}
                    >
                        <ToolbarBackButton />
                        <ToolbarBreadcrumb />
                    </Toolbar>
                    <MainContent>
                        <Container>
                            <Box>
                                <Typography variant={"h3"}>Page 2</Typography>
                                <BreadcrumbTree />
                            </Box>
                        </Container>
                    </MainContent>
                </>
            </StackPage>
            <StackPage name="page2-1">
                <Page21 />
            </StackPage>
            <StackPage name="page2-2">
                <Page22 />
            </StackPage>
        </StackSwitch>
    );
};

const Page21 = () => {
    return (
        <>
            <Toolbar>
                <ToolbarBackButton />
                <ToolbarBreadcrumb />
            </Toolbar>

            <MainContent>
                <Container>
                    <Box>
                        <Typography variant={"h3"}>Page 2-1</Typography>
                        <BreadcrumbTree />
                    </Box>
                </Container>
            </MainContent>
        </>
    );
};

const Page22 = () => {
    return (
        <>
            <Toolbar>
                <ToolbarBackButton />
                <ToolbarBreadcrumb />
            </Toolbar>

            <MainContent>
                <Container>
                    <Box>
                        <Typography variant={"h3"}>Page 2-2</Typography>
                        <BreadcrumbTree />
                    </Box>
                </Container>
            </MainContent>
        </>
    );
};

const Page3 = () => {
    return (
        <StackSwitch initialPage={"page3-0"}>
            <StackPage name="page3-0">
                <>
                    <Toolbar
                        actionItems={(stackSwitchApi: IStackSwitchApi | undefined) => {
                            return (
                                <Grid container spacing={4}>
                                    <Grid item>
                                        <Button
                                            variant={"contained"}
                                            color={"primary"}
                                            onClick={() => {
                                                stackSwitchApi?.activatePage("page3-1", "foo");
                                            }}
                                        >
                                            <Typography>Page 3-1</Typography>
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant={"contained"}
                                            color={"primary"}
                                            onClick={() => {
                                                stackSwitchApi?.activatePage("page3-2", "foo");
                                            }}
                                        >
                                            <Typography>Page 3-2</Typography>
                                        </Button>
                                    </Grid>
                                </Grid>
                            );
                        }}
                    >
                        <ToolbarBackButton />
                        <ToolbarBreadcrumb />
                    </Toolbar>
                    <MainContent>
                        <Container>
                            <Box>
                                <Typography variant={"h3"}>Page 3</Typography>
                                <BreadcrumbTree />
                            </Box>
                        </Container>
                    </MainContent>
                </>
            </StackPage>
            <StackPage name="page3-1">
                <Page31 />
            </StackPage>
            <StackPage name="page3-2">
                <Page32 />
            </StackPage>
        </StackSwitch>
    );
};

const Page31 = () => {
    return (
        <>
            <Toolbar>
                <ToolbarBackButton />
                <ToolbarBreadcrumb />
            </Toolbar>

            <MainContent>
                <Container>
                    <Box>
                        <Typography variant={"h3"}>Page 3-1</Typography>
                        <BreadcrumbTree />
                    </Box>
                </Container>
            </MainContent>
        </>
    );
};

const Page32 = () => {
    return (
        <>
            <Toolbar>
                <ToolbarBackButton />
                <ToolbarBreadcrumb />
            </Toolbar>

            <MainContent>
                <Container>
                    <Box>
                        <Typography variant={"h3"}>Page 3-2</Typography>
                        <BreadcrumbTree />
                    </Box>
                </Container>
            </MainContent>
        </>
    );
};

const Page4 = () => {
    return (
        <>
            <Toolbar>
                <ToolbarBackButton />
                <ToolbarBreadcrumb />
            </Toolbar>

            <MainContent>
                <Container>
                    <Typography variant={"h3"}>Page 4</Typography>

                    <Typography variant={"h6"}>Breadcrumb Tree</Typography>

                    <BreadcrumbTree />
                </Container>
            </MainContent>
        </>
    );
};

export const ToolbarBreadcrumbsSample = () => {
    const [StackSwitch] = useStackSwitch();

    return (
        <Stack topLevelTitle={"Breadcrumbs"} showBreadcrumbs={false} showBackButton={false}>
            <StackSwitch initialPage="page1">
                <StackPage name={"page1"}>
                    <Page1 />
                </StackPage>

                <StackPage name="page2">
                    <StackPageTitle title={`Page2`}>
                        <Page2 />
                    </StackPageTitle>
                </StackPage>
                <StackPage name="page3">
                    <StackPageTitle title={`Page3`}>
                        <Page3 />
                    </StackPageTitle>
                </StackPage>

                <StackPage name="page4">
                    <StackPageTitle title={`Page4`}>
                        <Page4 />
                    </StackPageTitle>
                </StackPage>
            </StackSwitch>
        </Stack>
    );
};
