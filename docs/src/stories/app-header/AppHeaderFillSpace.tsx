import { AppHeader, AppHeaderFillSpace } from "@comet/admin";
import { Typography } from "@mui/material";
import * as React from "react";

function Story() {
    return (
        <AppHeader position="relative" headerHeight={60}>
            <Typography style={{ padding: 20 }}>Left Content</Typography>

            <AppHeaderFillSpace />

            <Typography style={{ padding: 20 }}>Right Content</Typography>
        </AppHeader>
    );
}
export default Story;
