import { ClickAwayListener, Tooltip as MuiTooltip, TooltipProps as MuiTooltipProps } from "@mui/material";
import React, { cloneElement } from "react";

interface TooltipProps extends MuiTooltipProps {
    trigger?: "hover" | "focus" | "click";
}

export const Tooltip = ({ trigger = "hover", children, ...props }: TooltipProps): JSX.Element => {
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
            <MuiTooltip onClose={handleTooltipClose} open={open} disableFocusListener disableHoverListener disableTouchListener {...props}>
                {cloneElement(children, { onClick: toggleTooltip })}
            </MuiTooltip>
        </ClickAwayListener>
    ) : (
        <MuiTooltip disableFocusListener={trigger === "hover"} disableHoverListener={trigger === "focus"} {...props}>
            {children}
        </MuiTooltip>
    );
};
