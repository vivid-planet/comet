import {
    Breakpoint,
    Button as MuiButton,
    ButtonProps as MuiButtonProps,
    ComponentsOverrides,
    css,
    Theme,
    Tooltip,
    useTheme,
    useThemeProps,
} from "@mui/material";
import { OverridableComponent, OverridableTypeMap } from "@mui/material/OverridableComponent";
import { ElementType, ForwardedRef, forwardRef, ReactNode } from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { useWindowSize } from "../../helpers/useWindowSize";

type Variant = "primary" | "secondary" | "outlined" | "destructive" | "success" | "textLight" | "textDark";
type Slot = "root" | "mobileTooltip";
type ComponentState = Variant | "usingResponsiveBehavior";
export type ButtonClassKey = Slot | ComponentState;

export type ButtonProps<C extends ElementType = "button"> = Omit<MuiButtonProps<C>, "variant" | "color"> &
    ThemedComponentBaseProps<{
        root: typeof MuiButton;
        mobileTooltip: typeof Tooltip;
    }> & {
        variant?: Variant;
        responsive?: boolean;
        mobileIcon?: "auto" | "startIcon" | "endIcon" | ReactNode;
        mobileBreakpoint?: Breakpoint;
    };

interface ButtonTypeMap<C extends ElementType = "button"> extends OverridableTypeMap {
    props: ButtonProps<C>;
    defaultComponent: C;
}

type OwnerState = {
    variant: Variant;
    usingResponsiveBehavior: boolean;
};

const variantToMuiProps: Record<Variant, Partial<MuiButtonProps>> = {
    primary: { variant: "contained", color: "primary" },
    secondary: { variant: "contained", color: "secondary" },
    outlined: { variant: "outlined" },
    destructive: { variant: "outlined", color: "error" },
    success: { variant: "contained", color: "success" },
    textLight: { variant: "text" },
    textDark: { variant: "text" },
};

const getMobileIconNode = ({ mobileIcon, startIcon, endIcon }: Pick<ButtonProps, "mobileIcon" | "startIcon" | "endIcon">) => {
    if (mobileIcon === "auto") {
        return startIcon || endIcon;
    }

    if (mobileIcon === "startIcon") {
        return startIcon;
    }

    if (mobileIcon === "endIcon") {
        return endIcon;
    }

    return mobileIcon;
};

export const Button = forwardRef(<C extends ElementType = "button">(inProps: ButtonProps<C>, ref: ForwardedRef<any>) => {
    const {
        slotProps,
        sx,
        variant = "primary",
        responsive,
        mobileIcon = "auto",
        mobileBreakpoint = "sm",
        startIcon,
        endIcon,
        children,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminButton" });

    const windowSize = useWindowSize();
    const theme = useTheme();

    const mobileIconNode = getMobileIconNode({ mobileIcon, startIcon, endIcon });

    if (responsive && !mobileIconNode) {
        throw new Error("When `responsive` is true, you must provide `startIcon`, `endIcon` or `mobileIcon`.");
    }

    const ownerState: OwnerState = {
        variant,
        usingResponsiveBehavior: Boolean(responsive) && windowSize.width < theme.breakpoints.values[mobileBreakpoint],
    };

    const commonButtonProps = {
        disableFocusRipple: true,
        disableTouchRipple: true,
        ...variantToMuiProps[variant],
        sx: {
            ...variantToMuiProps[variant].sx,
            ...sx,
        },
        ...restProps,
        ownerState,
        ...slotProps?.root,
        ref,
    };

    if (ownerState.usingResponsiveBehavior) {
        return (
            <MobileTooltip title={children} {...slotProps?.mobileTooltip}>
                <span>
                    <Root {...commonButtonProps}>{mobileIconNode}</Root>
                </span>
            </MobileTooltip>
        );
    }

    return (
        <Root startIcon={startIcon} endIcon={endIcon} {...commonButtonProps}>
            {children}
        </Root>
    );
}) as OverridableComponent<ButtonTypeMap>;

const Root = createComponentSlot(MuiButton)<ButtonClassKey, OwnerState>({
    componentName: "Button",
    slotName: "root",
    classesResolver(ownerState) {
        return [ownerState.usingResponsiveBehavior && "usingResponsiveBehavior", ownerState.variant];
    },
})(
    ({ ownerState, theme }) => css`
        ${ownerState.usingResponsiveBehavior &&
        css`
            min-width: 0;
        `}

        ${ownerState.variant === "textLight" &&
        css`
            color: ${theme.palette.common.white};
            &:focus {
                color: ${theme.palette.primary.main};
            }

            &.Mui-disabled {
                color: ${theme.palette.grey[200]};
            }
        `}

        ${ownerState.variant === "textDark" &&
        css`
            color: ${theme.palette.common.black};
            &.Mui-disabled {
                background-color: ${theme.palette.secondary.contrastText};
                color: ${theme.palette.grey[200]};
            }
        `}
    `,
);

const MobileTooltip = createComponentSlot(Tooltip)<ButtonClassKey>({
    componentName: "Button",
    slotName: "mobileTooltip",
})();

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminButton: ButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminButton: ButtonProps;
    }

    interface Components {
        CometAdminButton?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminButton"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminButton"];
        };
    }
}
