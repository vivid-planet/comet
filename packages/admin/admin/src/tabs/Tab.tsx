import { Info } from "@comet/admin-icons";
import { Box, ComponentsOverrides, IconProps, Theme, Tooltip, TooltipProps, Typography } from "@mui/material";
import MuiTab, { TabProps as MuiTabProps } from "@mui/material/Tab";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

import { Status, StatusBadge } from "../statusBadge/StatusBadge";
import { styles, TabClassKey } from "./Tab.styles";

export interface TabProps extends Omit<MuiTabProps, "children" | "iconPosition"> {
    label: React.ReactNode;
    forceRender?: boolean;
    children: React.ReactNode;
    currentTab: number;
    icon?: React.FunctionComponentElement<IconProps>;
    status?: Status;
    showStatusIcon?: boolean;
    statusIcon?: React.FunctionComponentElement<IconProps>;
    showTooltip?: boolean;
    tooltipMessage?: string;
    tooltipIcon?: React.FunctionComponentElement<IconProps>;
    tooltipPlacement?: TooltipProps["placement"];
    smallTabText?: boolean;
}

export const Tab: React.FC<Omit<TabProps, "currentTab">> = () => null;

export function TabComponent({
    children,
    currentTab,
    label,
    showTooltip,
    tooltipIcon = <Info />,
    tooltipMessage,
    tooltipPlacement = "top",
    icon,
    classes,
    smallTabText,
    status,
    showStatusIcon,
    statusIcon,
    ...props
}: TabProps & WithStyles<typeof styles>) {
    icon =
        icon && React.isValidElement(icon)
            ? React.cloneElement(icon, { color: currentTab === props.value ? "primary" : "inherit" } as IconProps)
            : undefined;

    if (currentTab === props.value && props.disabled) throw new Error("The default selected tab can't be disabled.");

    if (showTooltip && !tooltipMessage) console.warn("A tooltip message (prop: tooltipMessage) has to be provided, if the tooltip icon should show.");

    return (
        <MuiTab
            className={classes.root}
            {...props}
            label={
                <Box display="flex" alignItems="center">
                    {status && <StatusBadge className={classes.status} status={status} showStatusIcon={showStatusIcon} statusIcon={statusIcon} />}
                    {icon && (
                        <Box component="span" className={classes.icon} color={currentTab === props.value ? "primary" : "inherit"}>
                            {icon}
                        </Box>
                    )}
                    <Typography component="h4" className={classes.label} variant={smallTabText ? "button" : "h6"}>
                        {label}
                    </Typography>
                </Box>
            }
            icon={
                showTooltip && React.isValidElement(tooltipIcon) && tooltipMessage ? (
                    <Tooltip title={tooltipMessage} className={classes.tooltip} placement={tooltipPlacement}>
                        <Box>{tooltipIcon}</Box>
                    </Tooltip>
                ) : undefined
            }
            iconPosition="end"
        />
    );
}

export const CustomTab = withStyles(styles, { name: "CometAdminTab" })(TabComponent);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminTab: TabClassKey;
    }

    interface ComponentsPropsList {
        CometAdminTab: TabProps;
    }

    interface Components {
        CometAdminTab?: {
            defaultProps?: ComponentsPropsList["CometAdminTab"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminTab"];
        };
    }
}
