import { AppHeader, AppHeaderButton, AppHeaderFillSpace } from "@comet/admin";
import { Typography } from "@mui/material";
import * as React from "react";

export default {
    title: "stories/components/AppHeader/Button text",
};

export const AppHeaderButtonText = {
    render: () => {
        return (
            <AppHeader position="relative" headerHeight={60}>
                <Typography style={{ padding: 20 }}>Header button</Typography>
                <AppHeaderFillSpace />

                <AppHeaderButton>My Button</AppHeaderButton>
            </AppHeader>
        );
    },

    name: "AppHeader Button text",
};
