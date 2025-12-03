import { AppHeader, AppHeaderMenuButton, CometLogo, FillSpace } from "@comet/admin";
import { useMediaQuery, useTheme } from "@mui/material";
import { type PropsWithChildren, type ReactNode } from "react";

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
            {!isMobile && <FillSpace />}
            {children}
        </AppHeader>
    );
}

export { Header };
