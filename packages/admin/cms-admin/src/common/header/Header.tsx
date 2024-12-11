import { AppHeader, AppHeaderFillSpace, AppHeaderMenuButton, CometLogo } from "@comet/admin";
import { useMediaQuery, useTheme } from "@mui/material";
import { PropsWithChildren, ReactNode } from "react";

interface Props {
    logo?: ReactNode;
}

function Header({ children, logo }: PropsWithChildren<Props>) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <AppHeader>
            <AppHeaderMenuButton />
            {!isMobile && (logo || <CometLogo color="white" />)}
            {!isMobile && <AppHeaderFillSpace />}
            {children}
        </AppHeader>
    );
}

export { Header };
