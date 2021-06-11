import { AppHeader, AppHeaderAction, AppHeaderFillSpace } from "@comet/admin";
import { Account } from "@comet/admin-icons";
import { Avatar, Box, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/AppHeader/Action custom", module).add("AppHeader Action custom", () => {
    return (
        <AppHeader position="relative" headerHeight={60}>
            <Typography style={{ padding: 20 }}>Header action custom content</Typography>
            <AppHeaderFillSpace />

            <AppHeaderAction>
                <Box display="flex" alignItems="center">
                    <Avatar style={{ marginRight: 10 }}>
                        <Account />
                    </Avatar>
                    User Name
                </Box>
            </AppHeaderAction>
        </AppHeader>
    );
});
