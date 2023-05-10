import { Box, BoxProps } from "@mui/material";
import * as React from "react";

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
