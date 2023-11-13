import { ClickAwayListener, ComponentsOverrides, Theme, Tooltip as MuiTooltip, tooltipClasses, TooltipProps as MuiTooltipProps } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import React, { cloneElement } from "react";

export interface TooltipProps extends MuiTooltipProps {
    trigger?: "hover" | "focus" | "click";
    variant?: Variant;
}
type Variant = "light" | "dark" | "neutral" | "primary";

export type TooltipClassKey = Variant;

const styles = (theme: Theme) =>
    createStyles<TooltipClassKey, TooltipProps>({
        light: {
            [`& .${tooltipClasses.arrow}`]: {
                color: theme.palette.common.white,
            },
            [`& .${tooltipClasses.tooltip}`]: {
                backgroundColor: theme.palette.common.white,
                color: theme.palette.common.black,
                boxShadow: theme.shadows[1],
            },
        },
        dark: {
            [`& .${tooltipClasses.arrow}`]: {
                color: theme.palette.grey[900],
            },
            [`& .${tooltipClasses.tooltip}`]: {
                backgroundColor: theme.palette.grey[900],
                color: theme.palette.common.white,
                boxShadow: theme.shadows[1],
            },
        },
        neutral: {
            [`& .${tooltipClasses.arrow}`]: {
                color: theme.palette.grey[100],
            },
            [`& .${tooltipClasses.tooltip}`]: {
                backgroundColor: theme.palette.grey[100],
                color: theme.palette.common.black,
            },
        },
        primary: {
            [`& .${tooltipClasses.arrow}`]: {
                color: theme.palette.primary.light,
            },
            [`& .${tooltipClasses.tooltip}`]: {
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.common.black,
            },
        },
    });

const Tooltip = ({ trigger = "hover", variant = "dark", children, classes, ...props }: TooltipProps & WithStyles<typeof styles>): JSX.Element => {
    const [open, setOpen] = React.useState(false);

    const handleTooltipClose = () => {
        setOpen(false);
    };

    const toggleTooltip = (event: React.MouseEvent) => {
        event.stopPropagation();
        setOpen(!open);
    };

    return trigger === "click" ? (
        <ClickAwayListener onClickAway={handleTooltipClose}>
            <MuiTooltip
                classes={{ popper: classes[variant] }}
                onClose={handleTooltipClose}
                open={open}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                {...props}
            >
                {cloneElement(children, { onClick: toggleTooltip })}
            </MuiTooltip>
        </ClickAwayListener>
    ) : (
        <MuiTooltip
            classes={{ popper: classes[variant] }}
            disableFocusListener={trigger === "hover"}
            disableHoverListener={trigger === "focus"}
            {...props}
        >
            {children}
        </MuiTooltip>
    );
};

const TooltipWithStyles = withStyles(styles, { name: "CometAdminTooltip" })(Tooltip);

export { TooltipWithStyles as Tooltip };

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminTooltip: Partial<TooltipProps>;
    }

    interface ComponentNameToClassKey {
        CometAdminTooltip: TooltipClassKey;
    }

    interface Components {
        CometAdminTooltip?: {
            defaultProps?: ComponentsPropsList["CometAdminTooltip"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminTooltip"];
        };
    }
}
