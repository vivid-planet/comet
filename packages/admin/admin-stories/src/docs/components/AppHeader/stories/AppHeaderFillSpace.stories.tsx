import { AppHeader, AppHeaderFillSpace } from "@comet/admin";
import { Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/AppHeader/FillSpace", module).add("AppHeader FillSpace", () => {
    return (
        <AppHeader position="relative" headerHeight={60}>
            <Typography style={{ padding: 20 }}>Left Content</Typography>

            <AppHeaderFillSpace />

            <Typography style={{ padding: 20 }}>Right Content</Typography>
        </AppHeader>
    );
});
