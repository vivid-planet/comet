import {
    AppHeader,
    AppHeaderFillSpace,
    AppHeaderMenuButton,
    CometLogo,
    MainContent,
    MasterLayout,
    Menu,
    MenuCollapsibleItem,
    MenuItemAnchorLink,
    MenuItemRouterLink,
    useWindowSize,
} from "@comet/admin";
import { CometColor, Dashboard, LinkExternal, Settings, Sort } from "@comet/admin-icons";
import { Card, CardContent, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Route, Switch } from "react-router";

import { storyRouterDecorator } from "../../story-router.decorator";

const permanentMenuMinWidth = 1024;

const AppMenu: React.FC = () => {
    const windowSize = useWindowSize();

    return (
        <Menu variant={windowSize.width < permanentMenuMinWidth ? "temporary" : "permanent"}>
            <MenuItemRouterLink primary="Dashboard" icon={<Dashboard />} to="/dashboard" />
            <MenuItemRouterLink primary="Settings" icon={<Settings />} to="/settings" />
            <MenuCollapsibleItem primary="More Items" icon={<Sort />}>
                <MenuItemRouterLink primary="Foo1" to="/foo1" />
                <MenuItemRouterLink primary="Foo2" to="/foo2" />
            </MenuCollapsibleItem>
            <MenuCollapsibleItem primary="Even More Items" icon={<Sort />}>
                <MenuItemRouterLink primary="Foo3" to="/foo3" />
                <MenuItemRouterLink primary="Foo4" to="/foo4" />
            </MenuCollapsibleItem>
            <MenuItemAnchorLink
                primary="Comet Admin"
                secondary="View on GitHub"
                target="_blank"
                href="https://github.com/vivid-planet/comet-admin"
                icon={<CometColor />}
                secondaryAction={<LinkExternal />}
            />
        </Menu>
    );
};

const Header: React.FC = () => (
    <AppHeader>
        <AppHeaderMenuButton />
        <CometLogo />
        <AppHeaderFillSpace />
    </AppHeader>
);

const Content = ({ children }: { children: string }) => (
    <MainContent>
        <Card variant="outlined">
            <CardContent>
                <Typography variant={"h1"} gutterBottom>
                    {children}
                </Typography>
                <Typography>The navigation is permanent by default and is temporary below {permanentMenuMinWidth}px.</Typography>
            </CardContent>
        </Card>
    </MainContent>
);

export const Story: React.FC = () => (
    <MasterLayout headerComponent={Header} menuComponent={AppMenu}>
        <Switch>
            <Route path="/" exact render={() => <Content>Root</Content>} />
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
    .addDecorator(storyRouterDecorator())
    .add("Menu", () => <Story />, { layout: "fullscreen" });
