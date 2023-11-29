import {
    ClickAwayListener,
    ComponentsOverrides,
    Popper as MuiPopper,
    Theme,
    Tooltip as MuiTooltip,
    tooltipClasses,
    TooltipClassKey as MuiTooltipClassKey,
    TooltipProps as MuiTooltipProps,
} from "@mui/material";
import { css, styled, useThemeProps } from "@mui/material/styles";
import React, { cloneElement } from "react";

export interface TooltipProps extends MuiTooltipProps {
    trigger?: "hover" | "focus" | "click";
    variant?: Variant;
}

type Variant = "light" | "dark" | "neutral" | "primary";

export type TooltipClassKey = "root" | Variant | MuiTooltipClassKey;

type OwnerState = {
    variant: Variant;
    disableInteractive: boolean | undefined;
    arrow: boolean | undefined;
    open: boolean | undefined;
};

const TooltipRoot = styled(MuiTooltip, {
    name: "CometAdminTooltip",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})();

const TooltipPopper = styled(MuiPopper, {
    name: "CometAdminTooltip",
    slot: "popper",
    overridesResolver({ ownerState }: { ownerState: OwnerState }, styles) {
        return [
            styles.popper,
            styles[ownerState.variant],
            // Copied the following from MUIs default TooltipPopper: https://github.com/mui/material-ui/blob/a13c0c026692aafc303756998a78f1d6c2dd707d/packages/mui-material/src/Tooltip/Tooltip.js#L48
            !ownerState.disableInteractive && styles.popperInteractive,
            ownerState.arrow && styles.popperArrow,
            !ownerState.open && styles.popperClose,
        ];
    },
})<{ ownerState: OwnerState }>(
    ({ theme, ownerState }) => css`
        ${ownerState.variant === "light" &&
        css`
            .${tooltipClasses.arrow} {
                color: ${theme.palette.common.white};
            }
            .${tooltipClasses.tooltip} {
                background-color: ${theme.palette.common.white};
                color: ${theme.palette.common.black};
                box-shadow: ${theme.shadows[1]};
            }
        `}

        ${ownerState.variant === "dark" &&
        css`
            .${tooltipClasses.arrow} {
                color: ${theme.palette.grey[900]};
            }
            .${tooltipClasses.tooltip} {
                background-color: ${theme.palette.grey[900]};
                color: ${theme.palette.common.white};
                box-shadow: ${theme.shadows[1]};
            }
        `}

        ${ownerState.variant === "neutral" &&
        css`
            .${tooltipClasses.arrow} {
                color: ${theme.palette.grey[100]};
            }
            .${tooltipClasses.tooltip} {
                background-color: ${theme.palette.grey[100]};
                color: ${theme.palette.common.black};
            }
        `}

        ${ownerState.variant === "primary" &&
        css`
            .${tooltipClasses.arrow} {
                color: ${theme.palette.primary.light};
            }
            .${tooltipClasses.tooltip} {
                background-color: ${theme.palette.primary.light};
                color: ${theme.palette.common.black};
            }
        `};

        // Copied the following from MUIs default TooltipPopper: https://github.com/mui/material-ui/blob/a13c0c026692aafc303756998a78f1d6c2dd707d/packages/mui-material/src/Tooltip/Tooltip.js#L55
        z-index: ${theme.zIndex.tooltip};
        pointer-events: none;
        ${!ownerState.disableInteractive &&
        css`
            pointer-events: auto;
        `};
        ${!ownerState.open &&
        css`
            pointer-events: none;
        `};
        ${ownerState.arrow &&
        css`
            &[data-popper-placement*="bottom"] .${tooltipClasses.arrow} {
                top: 0;
                margin-top: -0.71em;
                &::before {
                    transform-origin: 0 100%;
                }
            }
            &[data-popper-placement*="top"] .${tooltipClasses.arrow} {
                bottom: 0;
                margin-bottom: -0.71em;
                &::before {
                    transform-origin: 100% 0;
                }
            }
            &[data-popper-placement*="right"] .${tooltipClasses.arrow} {
                ${!ownerState.isRtl
                    ? css`
                          left: 0;
                          margin-left: -0.71em;
                      `
                    : css`
                          right: 0;
                          margin-right: -0.71em;
                      `}
                height: 1em;
                width: 0.71em;
                &::before {
                    transform-origin: 100% 100%;
                }
            }
            &[data-popper-placement*="left"] .${tooltipClasses.arrow} {
                ${!ownerState.isRtl
                    ? css`
                          right: 0;
                          margin-right: -0.71em;
                      `
                    : css`
                          left: 0;
                          margin-left: -0.71em;
                      `}
                height: 1em;
                width: 0.71em;
                &::before {
                    transform-origin: 0 0;
                }
            }
        `};
    `,
);

export const Tooltip = (inProps: TooltipProps) => {
    const {
        trigger = "hover",
        variant = "dark",
        disableInteractive,
        arrow,
        children,
        ...props
    } = useThemeProps({ props: inProps, name: "CometAdminTooltip" });

    const [open, setOpen] = React.useState(false);

    const handleTooltipClose = () => {
        setOpen(false);
    };

    const toggleTooltip = (event: React.MouseEvent) => {
        event.stopPropagation();
        setOpen(!open);
    };

    const ownerState: OwnerState = {
        variant,
        disableInteractive,
        arrow,
        open,
    };

    const commonTooltipProps = {
        ...props,
        ownerState,
        slots: {
            popper: TooltipPopper,
            ...props.slots,
        },
        slotProps: {
            popper: {
                ...props.slotProps?.popper,
                ownerState,
            },
            ...props.slotProps,
        },
    };

    return trigger === "click" ? (
        <ClickAwayListener onClickAway={handleTooltipClose}>
            <TooltipRoot
                onClose={handleTooltipClose}
                open={open}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                {...commonTooltipProps}
            >
                {cloneElement(children, { onClick: toggleTooltip })}
            </TooltipRoot>
        </ClickAwayListener>
    ) : (
        <TooltipRoot disableFocusListener={trigger === "hover"} disableHoverListener={trigger === "focus"} {...commonTooltipProps}>
            {children}
        </TooltipRoot>
    );
};

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
