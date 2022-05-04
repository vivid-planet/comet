import { AppHeader, AppHeaderFillSpace, AppHeaderMenuButton } from "@comet/admin";
import * as React from "react";

import { Logo } from "./Logo";

interface Props {
    children?: React.ReactNode;
    logo?: React.ReactNode;
}

function Header({ children, logo }: Props): React.ReactElement {
    return (
        <AppHeader>
            <AppHeaderMenuButton />
            {logo || <Logo />}
            <AppHeaderFillSpace />
            {children}
        </AppHeader>
    );
}

export { Header };
