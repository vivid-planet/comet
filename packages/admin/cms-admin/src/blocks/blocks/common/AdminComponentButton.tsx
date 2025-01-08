import { Button } from "@mui/material";
import { MouseEventHandler, PropsWithChildren, ReactNode } from "react";

import { AdminComponentPaper } from "./AdminComponentPaper";

interface Props {
    variant?: "primary" | "default";
    size?: "medium" | "large";
    startIcon?: ReactNode;
    onClick?: MouseEventHandler;
    disabled?: boolean;
}

export const AdminComponentButton = ({ variant, size, ...buttonProps }: PropsWithChildren<Props>) => {
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
};
