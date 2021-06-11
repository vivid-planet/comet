import { AppHeader, AppHeaderAction, AppHeaderFillSpace } from "@comet/admin";
import { Wrench } from "@comet/admin-icons";
import { Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/AppHeader/Action text and icon", module).add("AppHeader Action text and icon", () => {
    return (
        <AppHeader position="relative" headerHeight={60}>
            <Typography style={{ padding: 20 }}>Header actions with icon</Typography>
            <AppHeaderFillSpace />

            <AppHeaderAction startIcon={<Wrench />}>My Action</AppHeaderAction>

            <AppHeaderAction endIcon={<Wrench />}>My Action</AppHeaderAction>
        </AppHeader>
    );
});
