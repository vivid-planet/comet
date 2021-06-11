import { AppHeader, AppHeaderAction, AppHeaderFillSpace } from "@comet/admin";
import { Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/AppHeader/Action text", module).add("AppHeader Action text", () => {
    return (
        <AppHeader position="relative" headerHeight={60}>
            <Typography style={{ padding: 20 }}>Header action</Typography>
            <AppHeaderFillSpace />

            <AppHeaderAction>My Action</AppHeaderAction>
        </AppHeader>
    );
});
