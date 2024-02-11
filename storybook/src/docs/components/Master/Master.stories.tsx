import {
    AppHeader,
    AppHeaderButton,
    AppHeaderFillSpace,
    AppHeaderMenuButton,
    MainContent,
    MasterLayout,
    Menu,
    MenuItem,
    RouterBrowserRouter,
    Toolbar,
    ToolbarTitleItem,
} from "@comet/admin";
import { Dashboard, Wrench } from "@comet/admin-icons";
import { AppBar, Box, Card, CardContent, Drawer, Toolbar as MuiToolbar, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

const loremIpsumText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Nullam quis risus eget urna mollis ornare vel eu leo. Etiam porta sem malesuada magna mollis euismod. Maecenas sed diam eget risus varius blandit sit amet non magna.";

storiesOf("stories/components/Master", module)
    .addParameters({
        layout: "none",
        docs: {
            inlineStories: false,
        },
    })
    .add("Master", () => {
        function MasterMenu() {
            return (
                <Menu>
                    <MenuItem primary="Menu button" icon={<Dashboard />} />
                </Menu>
            );
        }

        function MasterHeader() {
            const [showDrawer, setShowDrawer] = React.useState<boolean>(false);
            return (
                <>
                    <AppHeader>
                        <AppHeaderMenuButton />
                        <AppHeaderFillSpace />
                        <AppHeaderButton startIcon={<Wrench />} onClick={() => setShowDrawer(true)}>
                            Open drawer
                        </AppHeaderButton>
                    </AppHeader>
                    <Drawer anchor="right" open={showDrawer} onClose={() => setShowDrawer(false)}>
                        <Box sx={{ width: 300 }}>
                            <AppBar position="relative">
                                <MuiToolbar>
                                    <Typography variant="h6">Drawer</Typography>
                                </MuiToolbar>
                            </AppBar>
                            <Box p={4}>
                                <Typography paragraph>{loremIpsumText}</Typography>
                                <Typography paragraph>{loremIpsumText}</Typography>
                                <Typography>{loremIpsumText}</Typography>
                            </Box>
                        </Box>
                    </Drawer>
                </>
            );
        }

        function Content() {
            return (
                <Card>
                    <CardContent>
                        <Typography variant="h1" gutterBottom>
                            App content
                        </Typography>
                        <Typography>{loremIpsumText}</Typography>
                    </CardContent>
                </Card>
            );
        }

        return (
            <RouterBrowserRouter>
                <MasterLayout menuComponent={MasterMenu} headerComponent={MasterHeader}>
                    <Toolbar>
                        <ToolbarTitleItem>Toolbar</ToolbarTitleItem>
                    </Toolbar>
                    <MainContent>
                        <Content />
                    </MainContent>
                </MasterLayout>
            </RouterBrowserRouter>
        );
    });
