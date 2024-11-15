import { ComponentProps } from "react";

import { useIsLastVisibleSwitch } from "../../stack/useIsLastVisibleSwitch";
import { Toolbar } from "./Toolbar";

export function StackToolbar(props: ComponentProps<typeof Toolbar>) {
    const isLastVisibleSwitch = useIsLastVisibleSwitch();

    // When inside a Stack, only the last Toolbar should be shown
    if (!isLastVisibleSwitch) {
        return null;
    }

    return <Toolbar {...props} />;
}
