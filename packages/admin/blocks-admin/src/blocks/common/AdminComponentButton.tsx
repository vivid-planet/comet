import { Button } from "@mui/material";
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
            <Button
                fullWidth
                color={variant === "primary" ? "primary" : "info"}
                sx={({ spacing }) => ({
                    ...(size === "large" && {
                        padding: spacing(4),
                    }),
                })}
                {...buttonProps}
            />
        </AdminComponentPaper>
    );
}
