// TODO: Use the following Components from Comet once they are available

import { Box, BoxProps, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

interface FullHeightBoxProps extends BoxProps {
    bottomSpacing?: number;
}

export const FullHeightBox: React.FC<FullHeightBoxProps> = ({ bottomSpacing = 0, children, ...boxProps }) => {
    boxProps.sx = {
        height: `calc(100vh - var(--comet-admin-master-layout-content-top-spacing) - ${bottomSpacing}px)`,
        ...boxProps.sx,
    };
    return <Box {...boxProps}>{children}</Box>;
};

export const CardToolbar = styled(Toolbar)`
    top: 0px;
    border-bottom: 1px solid ${({ theme }) => theme.palette.grey[100]};
`;

// TODO Make children aware of when disabled is set to true
export const Fieldset = styled("fieldset")`
    border: none;
`;
