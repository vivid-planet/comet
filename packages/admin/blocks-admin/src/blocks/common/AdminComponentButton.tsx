import { Button as MuiButton } from "@mui/material";
import { css, styled } from "@mui/material/styles";
import * as React from "react";

import { AdminComponentPaper } from "./AdminComponentPaper";

interface Props {
    variant?: "primary" | "default";
    size?: "medium" | "large";
    startIcon?: React.ReactNode;
    children?: React.ReactNode;
    onClick?: React.MouseEventHandler;
    disabled?: boolean;
}

export function AdminComponentButton({ variant, size, ...buttonProps }: Props): React.ReactElement {
    return (
        <AdminComponentPaper disablePadding>
            <Button fullWidth color={variant === "primary" ? "primary" : "info"} size={size} {...buttonProps} />
        </AdminComponentPaper>
    );
}

const Button = styled(MuiButton)<Pick<Props, "size">>`
    ${({ size, theme }) =>
        size === "large" &&
        css`
            padding: ${theme.spacing(4)};
        `}
`;
