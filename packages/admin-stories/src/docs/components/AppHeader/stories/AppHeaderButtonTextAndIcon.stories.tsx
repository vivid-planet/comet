import { AppHeader, AppHeaderButton, AppHeaderFillSpace } from "@comet/admin";
import { Wrench } from "@comet/admin-icons";
import { Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/AppHeader/Button text and icon", module).add("AppHeader Button text and icon", () => {
    return (
        <AppHeader position="relative" headerHeight={60}>
            <Typography style={{ padding: 20 }}>Header buttons with icon</Typography>
            <AppHeaderFillSpace />

            <AppHeaderButton startIcon={<Wrench />}>My Button</AppHeaderButton>

            <AppHeaderButton endIcon={<Wrench />}>My Button</AppHeaderButton>
        </AppHeader>
    );
});
