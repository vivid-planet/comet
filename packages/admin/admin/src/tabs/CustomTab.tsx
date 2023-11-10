import { Info } from "@comet/admin-icons";
import { errorPalette, greenPalette, warningPalette } from "@comet/admin-theme";
import { CheckRounded, HorizontalRuleRounded, PriorityHighRounded } from "@mui/icons-material";
import { Box, ComponentsOverrides, IconProps, Theme, Tooltip, TooltipProps, Typography } from "@mui/material";
import MuiTab, { TabProps as MuiTabProps } from "@mui/material/Tab";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

import { styles, TabClassKey } from "./CustomTab.styles";

type Status = "success" | "error" | "warning";

const colorMapping: { [K in Status]: any } = {
    success: greenPalette.main,
    error: errorPalette.main,
    warning: warningPalette.main,
};

const defaultIcons: { [K in Status]: React.ReactNode } = {
    success: <CheckRounded />,
    error: <PriorityHighRounded />,
    warning: <HorizontalRuleRounded />,
};

export interface TabProps extends Omit<MuiTabProps, "children" | "icon" | "iconPosition"> {
    label: React.ReactNode;
    forceRender?: boolean;
    children: React.ReactNode;
    currentTab: number;
    tabIcon?: React.ReactNode;
    status?: Status;
    showStatusIcon?: boolean;
    statusIcon?: React.ReactNode;
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
    showTooltip,
    tooltipIcon = <Info />,
    tooltipMessage,
    tooltipPlacement = "top",
    tabIcon,
    classes,
    smallTabText,
    status,
    showStatusIcon,
    statusIcon,
    ...props
}: TabProps & WithStyles<typeof styles>) {
    tabIcon =
        tabIcon && React.isValidElement(tabIcon)
            ? React.cloneElement(tabIcon, { color: currentTab === props.value ? "primary" : "inherit" } as IconProps)
            : undefined;

    if (currentTab === props.value && props.disabled) throw new Error("The default selected tab can't be disabled.");

    if (!status && (showStatusIcon || statusIcon)) console.warn("A status (prop: status) has to be provided, if the status icon should show.");

    if (status && statusIcon && !showStatusIcon) console.warn("The status icon will only be shown, if the showStatusIcon prop is set to true.");

    if (showTooltip && !tooltipMessage) console.warn("A tooltip message (prop: tooltipMessage) has to be provided, if the tooltip icon should show.");

    let statusColor: string | undefined;

    if (status) {
        statusColor = colorMapping[status];

        if (showStatusIcon && !statusIcon) {
            statusIcon = defaultIcons[status];
        }
    }

    return (
        <MuiTab
            className={classes.root}
            {...props}
            label={
                <Box display="flex" alignItems="center">
                    {status && (
                        <Box component="span" className={classes.status} bgcolor={statusColor}>
                            {showStatusIcon ? statusIcon : null}
                        </Box>
                    )}
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
