import { MainContent, MasterLayout, Menu, MenuCollapsibleItem, MenuItemAnchorLink, MenuItemRouterLink, Toolbar, useWindowSize } from "@comet/admin";
import { Box, Container, Typography } from "@material-ui/core";
import { Dashboard, GitHub, Launch, List, Settings } from "@material-ui/icons";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Route, Switch } from "react-router";
import StoryRouter from "storybook-react-router";

import CometLogo from "../../../.storybook/CometLogo";

const permanentMenuMinWidth = 1024;

const AppMenu: React.FC = () => {
    const windowSize = useWindowSize();

    return (
        <Menu variant={windowSize.width < permanentMenuMinWidth ? "temporary" : "permanent"}>
            <MenuItemRouterLink primary="Dashboard" icon={<Dashboard />} to="/dashboard" />
            <MenuItemRouterLink primary="Settings" icon={<Settings />} to="/settings" />
            <MenuCollapsibleItem primary="More Items" icon={<List />}>
                <MenuItemRouterLink primary="Foo1" to="/foo1" />
                <MenuItemRouterLink primary="Foo2" to="/foo2" />
            </MenuCollapsibleItem>
            <MenuCollapsibleItem primary="Even More Items" icon={<List />}>
                <MenuItemRouterLink primary="Foo3" to="/foo3" />
                <MenuItemRouterLink primary="Foo4" to="/foo4" />
            </MenuCollapsibleItem>
            <MenuItemAnchorLink
                primary="Comet Admin"
                secondary="View on GitHub"
                target="_blank"
                href="https://github.com/vivid-planet/comet-admin"
                icon={<GitHub />}
                secondaryAction={<Launch />}
            />
        </Menu>
    );
};

const AppHeader: React.FC = () => (
    <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} style={{ width: "100%" }}>
        <CometLogo />
        <Typography variant="h5">Menu Example</Typography>
    </Box>
);

const Content = ({ children }: { children: string }) => (
    <MainContent>
        <Typography variant={"h1"}>{children}</Typography>
        <br />
        <Typography>The navigation is permanent by default and is temporary below {permanentMenuMinWidth}px.</Typography>
    </MainContent>
);

export const Story: React.FC = () => (
    <MasterLayout headerComponent={AppHeader} menuComponent={AppMenu}>
        <Switch>
            <Route
                path="/"
                exact
                render={() => (
                    <>
                        <Toolbar />
                        <MainContent>
                            <Container>
                                <Box>
                                    {[...new Array(50)]
                                        .map(
                                            () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
                                        )
                                        .join("\n")}
                                </Box>
                            </Container>
                        </MainContent>
                    </>
                )}
            />
            <Route path="/dashboard" render={() => <Content>Dashboard</Content>} />
            <Route path="/settings" render={() => <Content>Settings</Content>} />
            <Route path="/foo1" render={() => <Content>Foo 1</Content>} />
            <Route path="/foo2" render={() => <Content>Foo 2</Content>} />
            <Route path="/foo3" render={() => <Content>Foo 3</Content>} />
            <Route path="/foo4" render={() => <Content>Foo 4</Content>} />
        </Switch>
    </MasterLayout>
);

storiesOf("@comet/admin/mui", module)
    .addDecorator(StoryRouter())
    .add("Menu with Toolbar", () => <Story />);
