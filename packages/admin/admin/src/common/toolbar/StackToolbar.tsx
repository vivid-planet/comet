import React from "react";

import { useStackApi } from "../../stack/Api";
import { useStackSwitchApi } from "../../stack/Switch";
import { Toolbar } from "./Toolbar";

export function StackToolbar(props: React.ComponentProps<typeof Toolbar>) {
    const stackApi = useStackApi();
    const stackSwitchApi = useStackSwitchApi();
    let shouldShow = true;
    if (stackApi && stackSwitchApi) {
        // When inside a Stack show only the last TabBar
        const ownSwitchIndex = stackSwitchApi.id ? stackApi.switches.findIndex((i) => i.id === stackSwitchApi.id) : -1;
        const nextSwitchShowsInitialPage = stackApi.switches[ownSwitchIndex + 1] && stackApi.switches[ownSwitchIndex + 1].isInitialPageActive;

        shouldShow = ownSwitchIndex === stackApi.switches.length - (nextSwitchShowsInitialPage ? 2 : 1);
    }

    if (!shouldShow) {
        return null;
    }

    return <Toolbar {...props} />;
}
