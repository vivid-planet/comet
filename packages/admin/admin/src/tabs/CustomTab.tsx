import { Info } from "@comet/admin-icons";
import { Box, IconProps, Tooltip, TooltipProps } from "@mui/material";
import MuiTab, { TabProps as MuiTabProps } from "@mui/material/Tab";
import * as React from "react";

export interface CustomTabProps extends Omit<MuiTabProps, "children" | "icon" | "iconPosition"> {
    label: React.ReactNode;
    currentTab: number;
    forceRender?: boolean;
    tabIcon?: React.ReactNode;
    showStatus?: boolean;
    showTooltip?: boolean;
    tooltipMessage?: string;
    tooltipIcon?: React.ReactNode;
    tooltipPlacement?: TooltipProps["placement"];
}

export interface TabProps extends Omit<MuiTabProps, "children"> {
    label: React.ReactNode;
    forceRender?: boolean;
    children: React.ReactNode;
}

export const Tab: React.FC<TabProps> = () => null;

export function CustomTab({
    currentTab,
    label,
    showStatus,
    showTooltip,
    tooltipIcon = <Info />,
    tooltipMessage,
    tooltipPlacement = "top",
    tabIcon,
    classes,
    ...props
}: CustomTabProps) {
    tabIcon =
        tabIcon && React.isValidElement(tabIcon)
            ? React.cloneElement(tabIcon, { color: currentTab === props.value ? "primary" : "inherit" } as IconProps)
            : undefined;

    if (showTooltip && !tooltipMessage)
        console.warn("You have to provide a tooltip message (prop: tooltipMessage), if you want the tooltip icon to show.");

    return (
        <MuiTab
            label={
                <Box display="flex" alignItems="center">
                    {showStatus && <Box component="span" mr={2} width="16px" height="16px" bgcolor="#14CC33" borderRadius="1000px" />}
                    {tabIcon && (
                        <Box component="span" display="flex" alignItems="center" mr={2} color={currentTab === props.value ? "primary" : "inherit"}>
                            {tabIcon}
                        </Box>
                    )}
                    {label}
                </Box>
            }
            sx={{ minHeight: "51px", padding: "20px 10px" }}
            icon={
                showTooltip && React.isValidElement(tooltipIcon) && tooltipMessage ? (
                    <Tooltip title={tooltipMessage} placement={tooltipPlacement}>
                        <Box>{tooltipIcon}</Box>
                    </Tooltip>
                ) : undefined
            }
            iconPosition="end"
            {...props}
        />
    );
}
