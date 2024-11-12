import { AppHeader } from "@comet/admin";
import * as React from "react";

export default {
    title: "stories/components/AppHeader/Empty",
};

export const AppHeaderEmpty = {
    render: () => {
        return (
            <AppHeader position="relative" headerHeight={60}>
                {/* AppHeader content should be here */}
            </AppHeader>
        );
    },

    name: "AppHeader Empty",
};
