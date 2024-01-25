import { AppHeader, AppHeaderButton, AppHeaderFillSpace } from "@comet/admin";
import { Wrench } from "@comet/admin-icons";
import { Typography } from "@mui/material";
import * as React from "react";

function Story() {
    return (
        <AppHeader position="relative" headerHeight={60}>
            <Typography style={{ padding: 20 }}>Header buttons with icon</Typography>
            <AppHeaderFillSpace />

            <AppHeaderButton startIcon={<Wrench />}>My Button</AppHeaderButton>

            <AppHeaderButton endIcon={<Wrench />}>My Button</AppHeaderButton>
        </AppHeader>
    );
}

export default Story;
