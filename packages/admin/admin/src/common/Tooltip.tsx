import {
    type ComponentsOverrides,
    Popper as MuiPopper,
    type Theme,
    // eslint-disable-next-line no-restricted-imports
    Tooltip as MuiTooltip,
    tooltipClasses,
    type TooltipClassKey as MuiTooltipClassKey,
    type TooltipProps as MuiTooltipProps,
    Typography,
} from "@mui/material";
import { css, useTheme, useThemeProps } from "@mui/material/styles";
import { type ReactNode } from "react";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

type SlotProps = MuiTooltipProps["slotProps"] &
    ThemedComponentBaseProps<{
        title: typeof Typography;
        text: typeof Typography;
    }>["slotProps"];

export interface TooltipProps extends Omit<MuiTooltipProps, "slotProps"> {
    variant?: Variant;
    description?: ReactNode;
    slotProps?: SlotProps;
}

type Slot = "root" | "title" | "text";
type Variant = "light" | "dark" | "neutral" | "primary" | "error" | "success" | "warning";
type ComponentState = "hasDescription";

export type TooltipClassKey = Slot | Variant | ComponentState | MuiTooltipClassKey;

type OwnerState = {
    variant: Variant;
    disableInteractive: boolean | undefined;
    arrow: boolean | undefined;
    isRtl: boolean;
    hasDescription: boolean;
};

const TooltipRoot = createComponentSlot(MuiTooltip)<TooltipClassKey, OwnerState>({
    componentName: "Tooltip",
    slotName: "root",
})();

const TooltipPopper = createComponentSlot(MuiPopper)<TooltipClassKey, OwnerState>({
    componentName: "Tooltip",
    slotName: "popper",
    classesResolver(ownerState) {
        return [
            ownerState.variant,
            // Copied the following from MUIs default TooltipPopper: https://github.com/mui/material-ui/blob/a13c0c026692aafc303756998a78f1d6c2dd707d/packages/mui-material/src/Tooltip/Tooltip.js#L48
            !ownerState.disableInteractive && "popperInteractive",
            ownerState.arrow && "popperArrow",
            ownerState.hasDescription && "hasDescription",
        ];
    },
})(
    ({ theme, ownerState }) => css`
        ${ownerState.hasDescription &&
        css`
            min-width: 200px;
        `}

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

        ${ownerState.variant === "error" &&
        css`
            .${tooltipClasses.arrow} {
                color: ${theme.palette.error.light};
            }
            .${tooltipClasses.tooltip} {
                background-color: ${theme.palette.error.light};
                color: ${theme.palette.common.white};
            }
        `};

        ${ownerState.variant === "success" &&
        css`
            .${tooltipClasses.arrow} {
                color: ${theme.palette.success.light};
            }
            .${tooltipClasses.tooltip} {
                background-color: ${theme.palette.success.light};
                color: ${theme.palette.common.black};
            }
        `};

        ${ownerState.variant === "warning" &&
        css`
            .${tooltipClasses.arrow} {
                color: ${theme.palette.warning.light};
            }
            .${tooltipClasses.tooltip} {
                background-color: ${theme.palette.warning.light};
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

const Title = createComponentSlot(Typography)<TooltipClassKey>({
    componentName: "Tooltip",
    slotName: "title",
})();

const Text = createComponentSlot(Typography)<TooltipClassKey>({
    componentName: "Tooltip",
    slotName: "text",
})();

export const Tooltip = (inProps: TooltipProps) => {
    const {
        variant = "dark",
        disableInteractive,
        arrow,
        children,
        title,
        description,
        slotProps = {},
        ...props
    } = useThemeProps({ props: inProps, name: "CometAdminTooltip" });
    const theme = useTheme();

    const ownerState: OwnerState = {
        variant,
        disableInteractive,
        arrow,
        isRtl: theme.direction === "rtl",
        hasDescription: !!description,
    };

    const { title: titleSlotProps, text: textSlotProps, ...muiSlotProps } = slotProps;

    const tooltipContent = description ? (
        <>
            <Title variant="subtitle2" {...titleSlotProps}>
                {title}
            </Title>
            <Text variant="body2" {...textSlotProps}>
                {description}
            </Text>
        </>
    ) : (
        <Text variant="body2" {...textSlotProps}>
            {title}
        </Text>
    );

    const commonTooltipProps = {
        ...props,
        title: tooltipContent,
        disableInteractive,
        arrow,
        ownerState,
        slots: {
            popper: TooltipPopper,
            ...props.slots,
        },
        slotProps: {
            ...muiSlotProps,
            popper: {
                ownerState,
                ...muiSlotProps?.popper,
            },
        },
    };

    return (
        <TooltipRoot enterTouchDelay={0} {...commonTooltipProps}>
            {children}
        </TooltipRoot>
    );
};

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminTooltip: TooltipProps;
    }

    interface ComponentNameToClassKey {
        CometAdminTooltip: TooltipClassKey;
    }

    interface Components {
        CometAdminTooltip?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminTooltip"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminTooltip"];
        };
    }
}
