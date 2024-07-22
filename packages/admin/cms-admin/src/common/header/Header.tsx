<<<<<<< HEAD
import { AppHeader, AppHeaderFillSpace, AppHeaderMenuButton } from "@comet/admin";
import { useMediaQuery, useTheme } from "@mui/material";
=======
import { AppHeader, AppHeaderFillSpace, AppHeaderMenuButton, CometLogo } from "@comet/admin";
>>>>>>> main
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
<<<<<<< HEAD
            {!isMobile && (logo || <Logo />)}
=======
            {logo || <CometLogo color="white" />}
>>>>>>> main
            <AppHeaderFillSpace />
            {children}
        </AppHeader>
    );
}

export { Header };
