import { AppHeader } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/AppHeader/Empty", module).add("AppHeader Empty", () => {
    return (
        <AppHeader position="relative" headerHeight={60}>
            {/* AppHeader content should be here */}
        </AppHeader>
    );
});
