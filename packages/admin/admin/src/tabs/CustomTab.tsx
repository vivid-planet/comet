import { Info } from "@comet/admin-icons";
import { Box, ComponentsOverrides, IconProps, Theme, Tooltip, TooltipProps, Typography } from "@mui/material";
import MuiTab, { TabProps as MuiTabProps } from "@mui/material/Tab";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

import { styles, TabClassKey } from "./CustomTab.styles";

export interface TabProps extends Omit<MuiTabProps, "children" | "icon" | "iconPosition"> {
    label: React.ReactNode;
    forceRender?: boolean;
    children: React.ReactNode;
    currentTab: number;
    tabIcon?: React.ReactNode;
    showStatus?: boolean;
    showTooltip?: boolean;
    tooltipMessage?: string;
    tooltipIcon?: React.ReactNode;
    tooltipPlacement?: TooltipProps["placement"];
    smallTabText?: boolean;
}

export const Tab: React.FC<Omit<TabProps, "currentTab"> & WithStyles<typeof styles>> = () => null;

export function TabComponent({
    children,
    currentTab,
    label,
    showStatus,
    showTooltip,
    tooltipIcon = <Info />,
    tooltipMessage,
    tooltipPlacement = "top",
    tabIcon,
    classes,
    smallTabText,
    ...props
}: TabProps & WithStyles<typeof styles>) {
    tabIcon =
        tabIcon && React.isValidElement(tabIcon)
            ? React.cloneElement(tabIcon, { color: currentTab === props.value ? "primary" : "inherit" } as IconProps)
            : undefined;

    if (currentTab === props.value && props.disabled) throw new Error("The default selected tab can't be disabled.");

    if (showTooltip && !tooltipMessage)
        console.warn("You have to provide a tooltip message (prop: tooltipMessage), if you want the tooltip icon to show.");

    return (
        <MuiTab
            className={classes.root}
            {...props}
            label={
                <Box display="flex" alignItems="center">
                    {showStatus && <Box component="span" className={classes.status} bgcolor="#14CC33" />}
                    {tabIcon && (
                        <Box component="span" className={classes.icon} color={currentTab === props.value ? "primary" : "inherit"}>
                            {tabIcon}
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
