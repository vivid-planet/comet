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
            <Button fullWidth color={variant === "primary" ? "primary" : "info"} increasedPadding={size === "large"} {...buttonProps} />
        </AdminComponentPaper>
    );
}

type ButtonProps = {
    increasedPadding: boolean;
};

const Button = styled(MuiButton)<ButtonProps>`
    ${({ increasedPadding, theme }) =>
        increasedPadding &&
        css`
            padding: ${theme.spacing(4)};
        `}
`;
