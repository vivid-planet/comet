import { AppHeader, AppHeaderMenuButton } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/AppHeader/MenuButton", module).add("AppHeader MenuButton", () => {
    return (
        <AppHeader position="relative" headerHeight={60}>
            <AppHeaderMenuButton />
        </AppHeader>
    );
});
