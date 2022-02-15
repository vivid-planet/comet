import { AppHeader, AppHeaderButton, AppHeaderFillSpace } from "@comet/admin";
import { Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/AppHeader/Button text", module).add("AppHeader Button text", () => {
    return (
        <AppHeader position="relative" headerHeight={60}>
            <Typography style={{ padding: 20 }}>Header button</Typography>
            <AppHeaderFillSpace />

            <AppHeaderButton>My Button</AppHeaderButton>
        </AppHeader>
    );
});
