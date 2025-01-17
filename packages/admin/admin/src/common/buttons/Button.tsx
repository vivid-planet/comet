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
import { forwardRef, ReactNode } from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { useWindowSize } from "../../helpers/useWindowSize";

type Variant = "primary" | "secondary" | "outlined" | "destructive" | "success" | "textLight" | "textDark";
type Slot = "root" | "mobileTooltip";
type ComponentState = Variant | "usingResponsiveBehavior";
export type ButtonClassKey = Slot | ComponentState;

export type ButtonProps = Omit<MuiButtonProps, "variant" | "color"> &
    ThemedComponentBaseProps<{
        root: typeof MuiButton;
        mobileTooltip: typeof Tooltip;
    }> & {
        variant?: Variant;
        responsive?: boolean;
        mobileIcon?: "auto" | "startIcon" | "endIcon" | ReactNode;
        mobileBreakpoint?: Breakpoint;
    };

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
    textLight: { variant: "text", sx: { color: "white" } },
    textDark: { variant: "text", sx: { color: "black" } },
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

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((inProps, ref) => {
    const {
        slotProps,
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
        ...variantToMuiProps[variant],
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
});

const Root = createComponentSlot(MuiButton)<ButtonClassKey, OwnerState>({
    componentName: "Button",
    slotName: "root",
    classesResolver(ownerState) {
        return [ownerState.usingResponsiveBehavior && "usingResponsiveBehavior", ownerState.variant];
    },
})(
    ({ ownerState }) => css`
        ${ownerState.usingResponsiveBehavior &&
        css`
            min-width: 0;
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
