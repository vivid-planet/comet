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
import { Card, CardContent, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

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
            return (
                <AppHeader>
                    <AppHeaderMenuButton />
                    <AppHeaderFillSpace />
                    <AppHeaderButton startIcon={<Wrench />}>AppHeader button</AppHeaderButton>
                </AppHeader>
            );
        }

        function Content() {
            return (
                <Card>
                    <CardContent>
                        <Typography variant="h1" gutterBottom>
                            App content
                        </Typography>
                        <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit
                            aliquet. Nullam quis risus eget urna mollis ornare vel eu leo. Etiam porta sem malesuada magna mollis euismod. Maecenas
                            sed diam eget risus varius blandit sit amet non magna.
                        </Typography>
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
