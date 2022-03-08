import { Button, makeStyles } from "@material-ui/core";
import clsx from "clsx";
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
    const classes = useStyles();

    return (
        <AdminComponentPaper disablePadding>
            <Button fullWidth color={variant} className={clsx(size === "large" && classes.buttonSizeLarge)} {...buttonProps} />
        </AdminComponentPaper>
    );
}

const useStyles = makeStyles((theme) => ({
    buttonSizeLarge: {
        padding: theme.spacing(4),
    },
}));
