import { AppHeader, AppHeaderMenuButton } from "@comet/admin";
import * as React from "react";

export default {
    title: "stories/components/AppHeader/MenuButton",
};

export const _AppHeaderMenuButton = {
    render: () => {
        return (
            <AppHeader position="relative" headerHeight={60}>
                <AppHeaderMenuButton />
            </AppHeader>
        );
    },

    name: "AppHeader MenuButton",
};
