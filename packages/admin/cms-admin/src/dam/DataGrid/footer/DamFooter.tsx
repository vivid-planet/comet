import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";

const FooterBar = styled(Paper)`
    position: fixed;
    z-index: 10;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);

    min-height: 60px;
    border-radius: 4px;

    background-color: ${({ theme }) => theme.palette.grey.A400};
    color: ${({ theme }) => theme.palette.grey.A100};

    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 30px;

    padding-left: 20px;
    padding-right: 20px;
`;

interface DamFooterProps {
    open: boolean;
}

export const DamFooter: React.FunctionComponent<DamFooterProps> = ({ children }) => {
    if (!open) {
        return null;
    }

    return <FooterBar>{children}</FooterBar>;
};
