import { AppHeader, AppHeaderFillSpace, AppHeaderMenuButton, CometLogoWhite } from "@comet/admin";
import * as React from "react";

interface Props {
    children?: React.ReactNode;
    logo?: React.ReactNode;
}

function Header({ children, logo }: Props): React.ReactElement {
    return (
        <AppHeader>
            <AppHeaderMenuButton />
            {logo || <CometLogoWhite />}
            <AppHeaderFillSpace />
            {children}
        </AppHeader>
    );
}

export { Header };
