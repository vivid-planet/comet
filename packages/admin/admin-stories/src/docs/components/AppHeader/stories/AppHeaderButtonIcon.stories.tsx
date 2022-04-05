import { AppHeader, AppHeaderButton, AppHeaderFillSpace } from "@comet/admin";
import { SwitchUser, Wrench } from "@comet/admin-icons";
import { Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/AppHeader/Button icon", module).add("AppHeader Button icon", () => {
    return (
        <AppHeader position="relative" headerHeight={60}>
            <Typography style={{ padding: 20 }}>Header buttons with icon only</Typography>
            <AppHeaderFillSpace />

            <AppHeaderButton>
                <SwitchUser />
            </AppHeaderButton>

            <AppHeaderButton>
                <Wrench color={"primary"} />
            </AppHeaderButton>
        </AppHeader>
    );
});
