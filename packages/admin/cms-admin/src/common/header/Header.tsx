import { AppHeader, AppHeaderFillSpace, AppHeaderMenuButton, CometLogo } from "@comet/admin";
import * as React from "react";

interface Props {
    children?: React.ReactNode;
    logo?: React.ReactNode;
}

function Header({ children, logo }: Props): React.ReactElement {
    return (
        <AppHeader>
            <AppHeaderMenuButton />
            {logo || <CometLogo color="white" />}
            <AppHeaderFillSpace />
            {children}
        </AppHeader>
    );
}

export { Header };
