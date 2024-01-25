import { AppHeader, AppHeaderButton, AppHeaderFillSpace } from "@comet/admin";
import { SwitchUser, Wrench } from "@comet/admin-icons";
import { Typography } from "@mui/material";
import * as React from "react";

function Story() {
    return (
        <AppHeader position="relative" headerHeight={60}>
            <Typography style={{ padding: 20 }}>Header buttons with icon only</Typography>
            <AppHeaderFillSpace />

            <AppHeaderButton>
                <SwitchUser />
            </AppHeaderButton>

            <AppHeaderButton>
                <Wrench color="primary" />
            </AppHeaderButton>
        </AppHeader>
    );
}

export default Story;
