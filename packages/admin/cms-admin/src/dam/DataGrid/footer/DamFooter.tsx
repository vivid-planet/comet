import { Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";

const FooterBar = styled(Paper)`
    position: fixed;
    z-index: 10;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);

    min-width: 1280px;
    min-height: 60px;
    border-radius: 4px;

    background-color: ${({ theme }) => theme.palette.primary.dark};
    color: ${({ theme }) => theme.palette.primary.contrastText};

    display: flex;
    justify-content: center;
    align-items: center;
`;

const AlignTextAndImage = styled(Typography)`
    display: flex;
    align-items: center;
`;

interface DamFooterProps {
    open: boolean;
}

export const DamFooter: React.FunctionComponent<DamFooterProps> = ({ children }) => {
    if (!open) {
        return null;
    }

    return (
        <>
            <FooterBar>
                <AlignTextAndImage>{children}</AlignTextAndImage>
            </FooterBar>
        </>
    );
};
