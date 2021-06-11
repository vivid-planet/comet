import { AppHeader, AppHeaderAction, AppHeaderFillSpace } from "@comet/admin";
import { SwitchUser, Wrench } from "@comet/admin-icons";
import { Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/AppHeader/Action icon", module).add("AppHeader Action icon", () => {
    return (
        <AppHeader position="relative" headerHeight={60}>
            <Typography style={{ padding: 20 }}>Header actions with icon only</Typography>
            <AppHeaderFillSpace />

            <AppHeaderAction>
                <SwitchUser />
            </AppHeaderAction>

            <AppHeaderAction>
                <Wrench color={"primary"} />
            </AppHeaderAction>
        </AppHeader>
    );
});
