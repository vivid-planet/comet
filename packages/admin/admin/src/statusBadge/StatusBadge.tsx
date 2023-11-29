import { CheckRounded, ExclamationmarkRounded, HyphenRounded } from "@comet/admin-icons";
import { Box, ComponentsOverrides, IconProps, Theme } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

import { StatusBadgeClassKey, styles } from "./StatusBadge.styles";

export type Status = "success" | "error" | "warning";

const defaultIcons: { [K in Status]: React.FunctionComponentElement<IconProps> } = {
    success: <CheckRounded fontSize="inherit" />,
    error: <ExclamationmarkRounded fontSize="inherit" />,
    warning: <HyphenRounded fontSize="inherit" />,
};

export interface StatusBadgeProps {
    status: Status;
    className?: string;
    showStatusIcon?: boolean;
    statusIcon?: React.FunctionComponentElement<IconProps> | undefined;
}

export function StatusBadgeComponent({ status, className, statusIcon, showStatusIcon, classes }: StatusBadgeProps & WithStyles<typeof styles>) {
    if (!status && (showStatusIcon || statusIcon)) console.warn("A status (prop: status) has to be provided, if the status icon should show.");

    if (status && statusIcon && !showStatusIcon) console.warn("The status icon will only be shown, if the showStatusIcon prop is set to true.");

    // TODO remove admin theme package
    const { palette } = useTheme();
    const colorMapping: { [K in Status]: string } = {
        success: palette.success.main,
        error: palette.error.main,
        warning: palette.warning.main,
    };

    const statusColor = colorMapping[status];

    if (showStatusIcon && !statusIcon) {
        statusIcon = defaultIcons[status];
    }

    return (
        <Box component="span" className={[className, classes.root].join(" ")} bgcolor={statusColor}>
            {showStatusIcon && React.isValidElement(statusIcon)
                ? React.cloneElement<IconProps>(statusIcon, { fontSize: "inherit" }) // overwrite fontSize prop to always have the same inherited size
                : null}
        </Box>
    );
}

export const StatusBadge = withStyles(styles, { name: "CometAdminStatusBadge" })(StatusBadgeComponent);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminStatusBadge: StatusBadgeClassKey;
    }

    interface ComponentsPropsList {
        CometAdminStatusBadge: StatusBadgeProps;
    }

    interface Components {
        CometAdminStatusBadge?: {
            defaultProps?: ComponentsPropsList["CometAdminStatusBadge"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminStatusBadge"];
        };
    }
}
