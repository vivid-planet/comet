import { AppHeader, AppHeaderMenuButton, CometLogo, FillSpace } from "@comet/admin";
import { useMediaQuery, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { type PropsWithChildren, type ReactNode } from "react";

const LogoWrapper = styled("div")`
    ${({ theme }) => theme.breakpoints.up("md")} {
        margin-left: 14px;
    }
`;

interface Props {
    logo?: ReactNode;
}

function Header({ children, logo }: PropsWithChildren<Props>) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <AppHeader>
            <AppHeaderMenuButton />
            {!isMobile && <LogoWrapper>{logo || <CometLogo color="white" />}</LogoWrapper>}
            {!isMobile && <FillSpace />}
            {children}
        </AppHeader>
    );
}

export { Header };
