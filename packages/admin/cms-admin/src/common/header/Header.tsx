import { AppHeader, AppHeaderFillSpace, AppHeaderMenuButton, useWindowSize } from "@comet/admin";
import * as React from "react";

import { Logo } from "./Logo";

interface Props {
    children?: React.ReactNode;
    logo?: React.ReactNode;
}

function Header({ children, logo }: Props): React.ReactElement {
    const window = useWindowSize();
    const isMobile = window.width <= 900; //MUI medium breakpoint 900px

    return (
        <AppHeader>
            <AppHeaderMenuButton />
            {!isMobile && (logo || <Logo />)}
            <AppHeaderFillSpace />
            {children}
        </AppHeader>
    );
}

export { Header };
