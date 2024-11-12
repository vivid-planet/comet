import { AppHeader, AppHeaderButton, AppHeaderFillSpace } from "@comet/admin";
import { Account } from "@comet/admin-icons";
import { Avatar, Box, Typography } from "@mui/material";
import * as React from "react";

export default {
    title: "stories/components/AppHeader/Button custom",
};

export const AppHeaderButtonCustom = {
    render: () => {
        return (
            <AppHeader position="relative" headerHeight={60}>
                <Typography style={{ padding: 20 }}>Header button custom content</Typography>
                <AppHeaderFillSpace />

                <AppHeaderButton>
                    <Box display="flex" alignItems="center">
                        <Avatar style={{ marginRight: 10 }}>
                            <Account />
                        </Avatar>
                        User Name
                    </Box>
                </AppHeaderButton>
            </AppHeader>
        );
    },

    name: "AppHeader Button custom",
};
