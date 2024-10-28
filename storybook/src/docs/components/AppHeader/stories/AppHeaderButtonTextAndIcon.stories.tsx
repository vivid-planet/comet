import { AppHeader, AppHeaderButton, AppHeaderFillSpace } from "@comet/admin";
import { Wrench } from "@comet/admin-icons";
import { Typography } from "@mui/material";
import * as React from "react";

export default {
    title: "stories/components/AppHeader/Button text and icon",
};

export const AppHeaderButtonTextAndIcon = () => {
    return (
        <AppHeader position="relative" headerHeight={60}>
            <Typography style={{ padding: 20 }}>Header buttons with icon</Typography>
            <AppHeaderFillSpace />

            <AppHeaderButton startIcon={<Wrench />}>My Button</AppHeaderButton>

            <AppHeaderButton endIcon={<Wrench />}>My Button</AppHeaderButton>
        </AppHeader>
    );
};

AppHeaderButtonTextAndIcon.storyName = "AppHeader Button text and icon";
