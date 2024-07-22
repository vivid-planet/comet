import { AppHeader, AppHeaderFillSpace, AppHeaderMenuButton, CometLogo } from "@comet/admin";
import { useMediaQuery, useTheme } from "@mui/material";
import * as React from "react";

interface Props {
    children?: React.ReactNode;
    logo?: React.ReactNode;
}

function Header({ children, logo }: Props): React.ReactElement {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <AppHeader>
            <AppHeaderMenuButton />
            {!isMobile && (logo || <CometLogo color="white" />)}
            <AppHeaderFillSpace />
            {children}
        </AppHeader>
    );
}

export { Header };
