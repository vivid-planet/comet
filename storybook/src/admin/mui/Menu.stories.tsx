import {
    AppHeader,
    AppHeaderMenuButton,
    CometLogo,
    FillSpace,
    MainContent,
    MainNavigation,
    MainNavigationCollapsibleItem,
    MainNavigationItemAnchorLink,
    MainNavigationItemGroup,
    MainNavigationItemRouterLink,
    MasterLayout,
    useWindowSize,
} from "@comet/admin";
import {
    Account,
    Archive,
    Assets,
    Calendar,
    CometColor,
    Dashboard,
    Document,
    File,
    Folder,
    Language,
    Link,
    Mail,
    Preview,
    Settings,
    Sort,
    Tag,
    Wrench,
} from "@comet/admin-icons";
import { Card, CardContent, Typography } from "@mui/material";
import { Route, Switch } from "react-router";

import { storyRouterDecorator } from "../../story-router.decorator";

const permanentMenuMinWidth = 1024;

const AppMenu = () => {
    const windowSize = useWindowSize();

    return (
        <MainNavigation variant={windowSize.width < permanentMenuMinWidth ? "temporary" : "permanent"}>
            <MainNavigationItemGroup title="Some Group">
                <MainNavigationItemRouterLink primary="Dashboard" icon={<Dashboard />} to="/dashboard" />
                <MainNavigationCollapsibleItem primary="More Items" icon={<Sort />}>
                    <MainNavigationItemRouterLink primary="Foo1" to="/foo1" />
                    <MainNavigationItemRouterLink primary="Foo2" to="/foo2" />
                </MainNavigationCollapsibleItem>
                <MainNavigationCollapsibleItem primary="Even More Items" icon={<Sort />}>
                    <MainNavigationItemRouterLink primary="Foo3" to="/foo3" />
                    <MainNavigationItemRouterLink primary="Foo4" to="/foo4" />
                    <MainNavigationCollapsibleItem primary="Wow there can be even more">
                        <MainNavigationItemRouterLink primary="Foo5" to="/foo5" />
                        <MainNavigationItemRouterLink primary="Foo6" to="/foo6" />
                    </MainNavigationCollapsibleItem>
                </MainNavigationCollapsibleItem>
            </MainNavigationItemGroup>
            <MainNavigationItemGroup title="Further Layers">
                <MainNavigationItemRouterLink primary="Settings" badgeContent={2} icon={<Settings />} to="/settings" />
                <MainNavigationItemAnchorLink
                    primary="Comet Admin"
                    secondary="View on GitHub"
                    target="_blank"
                    href="https://github.com/vivid-planet/comet"
                    icon={<CometColor />}
                />
            </MainNavigationItemGroup>
        </MainNavigation>
    );
};

const Header = () => (
    <AppHeader>
        <AppHeaderMenuButton />
        <CometLogo />
        <FillSpace />
    </AppHeader>
);

const Content = ({ children }: { children: string }) => (
    <MainContent>
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h1" gutterBottom>
                    {children}
                </Typography>
                <Typography>The navigation is permanent by default and is temporary below {permanentMenuMinWidth}px.</Typography>
            </CardContent>
        </Card>
    </MainContent>
);

export default {
    title: "@comet/admin/mui",
    decorators: [storyRouterDecorator()],
    excludeStories: ["Story"],
};

export const _Menu = {
    render: () => (
        <MasterLayout headerComponent={Header} menuComponent={AppMenu}>
            <Switch>
                <Route path="/" exact render={() => <Content>Root</Content>} />
                <Route path="/dashboard" render={() => <Content>Dashboard</Content>} />
                <Route path="/settings" render={() => <Content>Settings</Content>} />
                <Route path="/foo1" render={() => <Content>Foo 1</Content>} />
                <Route path="/foo2" render={() => <Content>Foo 2</Content>} />
                <Route path="/foo3" render={() => <Content>Foo 3</Content>} />
                <Route path="/foo4" render={() => <Content>Foo 4</Content>} />
                <Route path="/foo5" render={() => <Content>Foo 5</Content>} />
                <Route path="/foo6" render={() => <Content>Foo 6</Content>} />
            </Switch>
        </MasterLayout>
    ),

    parameters: { layout: "fullscreen" },
};

const AppMenuWithManyItems = () => {
    const windowSize = useWindowSize();

    return (
        <MainNavigation variant={windowSize.width < permanentMenuMinWidth ? "temporary" : "permanent"}>
            <MainNavigationItemGroup title="Content">
                <MainNavigationItemRouterLink primary="Dashboard" icon={<Dashboard />} to="/dashboard" />
                <MainNavigationItemRouterLink primary="Pages" icon={<Document />} to="/pages" />
                <MainNavigationItemRouterLink primary="Assets" icon={<Assets />} to="/assets" />
                <MainNavigationItemRouterLink primary="Files" icon={<File />} to="/files" />
                <MainNavigationItemRouterLink primary="Folders" icon={<Folder />} to="/folders" />
                <MainNavigationCollapsibleItem primary="Blog" icon={<Tag />}>
                    <MainNavigationItemRouterLink primary="Posts" to="/blog/posts" />
                    <MainNavigationItemRouterLink primary="Categories" to="/blog/categories" />
                    <MainNavigationItemRouterLink primary="Tags" to="/blog/tags" />
                </MainNavigationCollapsibleItem>
            </MainNavigationItemGroup>
            <MainNavigationItemGroup title="Communication">
                <MainNavigationItemRouterLink primary="Mail Campaigns" icon={<Mail />} to="/email" />
                <MainNavigationItemRouterLink primary="Newsletters" icon={<Mail />} to="/newsletters" />
                <MainNavigationItemRouterLink primary="Preview" icon={<Preview />} to="/preview" />
                <MainNavigationCollapsibleItem primary="Languages" icon={<Language />}>
                    <MainNavigationItemRouterLink primary="English" to="/languages/en" />
                    <MainNavigationItemRouterLink primary="German" to="/languages/de" />
                    <MainNavigationItemRouterLink primary="French" to="/languages/fr" />
                    <MainNavigationItemRouterLink primary="Spanish" to="/languages/es" />
                </MainNavigationCollapsibleItem>
            </MainNavigationItemGroup>
            <MainNavigationItemGroup title="Structure">
                <MainNavigationItemRouterLink primary="Links" icon={<Link />} to="/links" />
                <MainNavigationItemRouterLink primary="Calendar" icon={<Calendar />} to="/calendar" />
                <MainNavigationItemRouterLink primary="Archive" icon={<Archive />} to="/archive" />
                <MainNavigationItemRouterLink primary="Accounts" icon={<Account />} to="/accounts" />
            </MainNavigationItemGroup>
            <MainNavigationItemGroup title="Settings">
                <MainNavigationItemRouterLink primary="Settings" badgeContent={2} icon={<Settings />} to="/settings" />
                <MainNavigationItemRouterLink primary="Configuration" icon={<Wrench />} to="/configuration" />
                <MainNavigationItemRouterLink primary="Sort" icon={<Sort />} to="/sort" />
                <MainNavigationItemAnchorLink
                    primary="Comet Admin"
                    secondary="View on GitHub"
                    target="_blank"
                    href="https://github.com/vivid-planet/comet"
                    icon={<CometColor />}
                />
            </MainNavigationItemGroup>
        </MainNavigation>
    );
};

export const MenuWithManyItems = {
    render: () => (
        <MasterLayout headerComponent={Header} menuComponent={AppMenuWithManyItems}>
            <Switch>
                <Route path="/" exact render={() => <Content>Root</Content>} />
                <Route path="/dashboard" render={() => <Content>Dashboard</Content>} />
                <Route path="/pages" render={() => <Content>Pages</Content>} />
                <Route path="/assets" render={() => <Content>Assets</Content>} />
                <Route path="/files" render={() => <Content>Files</Content>} />
                <Route path="/folders" render={() => <Content>Folders</Content>} />
                <Route path="/blog/posts" render={() => <Content>Blog Posts</Content>} />
                <Route path="/blog/categories" render={() => <Content>Blog Categories</Content>} />
                <Route path="/blog/tags" render={() => <Content>Blog Tags</Content>} />
                <Route path="/email" render={() => <Content>Email Campaigns</Content>} />
                <Route path="/newsletters" render={() => <Content>Newsletters</Content>} />
                <Route path="/preview" render={() => <Content>Preview</Content>} />
                <Route path="/languages/en" render={() => <Content>English</Content>} />
                <Route path="/languages/de" render={() => <Content>German</Content>} />
                <Route path="/languages/fr" render={() => <Content>French</Content>} />
                <Route path="/languages/es" render={() => <Content>Spanish</Content>} />
                <Route path="/links" render={() => <Content>Links</Content>} />
                <Route path="/calendar" render={() => <Content>Calendar</Content>} />
                <Route path="/archive" render={() => <Content>Archive</Content>} />
                <Route path="/accounts" render={() => <Content>Accounts</Content>} />
                <Route path="/settings" render={() => <Content>Settings</Content>} />
                <Route path="/configuration" render={() => <Content>Configuration</Content>} />
                <Route path="/sort" render={() => <Content>Sort</Content>} />
            </Switch>
        </MasterLayout>
    ),

    parameters: { layout: "fullscreen" },
};
