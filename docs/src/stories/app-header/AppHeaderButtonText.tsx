import { AppHeader, AppHeaderButton, AppHeaderFillSpace } from "@comet/admin";
import { Typography } from "@mui/material";
import * as React from "react";
function Story() {
    return (
        <AppHeader position="relative" headerHeight={60}>
            <Typography style={{ padding: 20 }}>Header button</Typography>
            <AppHeaderFillSpace />

            <AppHeaderButton>My Button</AppHeaderButton>
        </AppHeader>
    );
}
export default Story;
