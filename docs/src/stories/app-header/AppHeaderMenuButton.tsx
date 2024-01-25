import { AppHeader, AppHeaderMenuButton } from "@comet/admin";
import * as React from "react";

function Story() {
    return (
        <AppHeader position="relative" headerHeight={60}>
            <AppHeaderMenuButton />
        </AppHeader>
    );
}
export default Story;
