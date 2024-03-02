import React from "react";

import { useStackApi } from "../../stack/Api";
import { useStackSwitchApi } from "../../stack/Switch";
import { Toolbar, ToolbarProps } from "./Toolbar";

export function StackToolbar(props: ToolbarProps) {
    const stackApi = useStackApi();
    const stackSwitchApi = useStackSwitchApi();
    let shouldShowTabBar = true;
    if (stackApi && stackSwitchApi) {
        // When inside a Stack show only the last TabBar
        const ownSwitchIndex = stackSwitchApi.id ? stackApi.switches.findIndex((i) => i.id === stackSwitchApi.id) : -1;
        const nextSwitchShowsInitialPage = stackApi.switches[ownSwitchIndex + 1] && stackApi.switches[ownSwitchIndex + 1].isInitialPageActive;

        shouldShowTabBar = ownSwitchIndex === stackApi.switches.length - (nextSwitchShowsInitialPage ? 2 : 1);
    }

    if (!shouldShowTabBar) {
        return null;
    }

    return (
        <Toolbar {...props} />
    );
}
