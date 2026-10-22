import {
    Button as UiButton,
    ButtonLink as UiButtonLink,
    type ButtonLinkSlotProps,
    type ButtonProps as UiButtonProps,
    type ButtonSize,
    type ButtonTone,
    type ButtonVariant as UiButtonVariant,
} from "@dextinity/ui";
import { type Breakpoint, css, styled, useTheme } from "@mui/material/styles";
import type { ComponentPropsWithRef, CSSProperties, ElementType, JSX, MouseEvent, ReactNode } from "react";

import { Tooltip, type TooltipProps } from "../../common/Tooltip";
import { useWindowSize } from "../../helpers/useWindowSize";

type Variant = "primary" | "secondary" | "outlined" | "destructive" | "success" | "textLight" | "textDark";
type Slot = "root" | "mobileTooltip";
type ComponentState = Variant | "usingResponsiveBehavior";
export type ButtonClassKey = Slot | ComponentState;

interface ButtonOwnProps {
    /**
     * The button's emphasis and color: `primary` for the main action, `secondary` and `outlined` for the actions
     * next to it, `destructive` for an action that deletes, `success` for one that completes something, and
     * `textDark` for less important actions. Use `textLight` on a dark background.
     *
     * @defaultValue `"primary"`
     */
    variant?: Variant;
    /** @defaultValue `"medium"` */
    size?: ButtonSize;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    /** Stretches the button to the width of its container. */
    fullWidth?: boolean;
    /** Below `mobileBreakpoint`, the button shows only its icon, with its text in a tooltip. */
    responsive?: boolean;
    mobileIcon?: "auto" | "startIcon" | "endIcon" | ReactNode;
    mobileBreakpoint?: Breakpoint;
    disabled?: boolean;
    /** Keeps the disabled button reachable by keyboard, for example while it shows that it is saving. */
    focusableWhenDisabled?: boolean;
    /** A link's URL. The button then renders an `<a>` element. */
    href?: string;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
    /**
     * Props for the inner parts: `startIcon`, `endIcon` and `mobileTooltip`, the tooltip with the text below
     * `mobileBreakpoint`. As a function, an icon slot receives `variant`, `size` and `tone`, which a button and a
     * link have in common.
     */
    slotProps?: ButtonLinkSlotProps & { mobileTooltip?: Partial<TooltipProps> };
    /**
     * @deprecated Use variant instead. The button's color is controlled by the variant prop.
     */
    color?: string;
}

export type ButtonProps<C extends ElementType = "button"> = ButtonOwnProps & {
    /** A link component, such as `StackLink` or a router's `Link`, which the button then renders in the look of a button. */
    component?: C;
} & Omit<C extends "button" ? Omit<UiButtonProps, "variant" | "tone"> : ComponentPropsWithRef<C>, keyof ButtonOwnProps | "component">;

interface ButtonComponent {
    <C extends ElementType>(props: ButtonProps<C> & { component: C }): JSX.Element;
    (props: ButtonProps): JSX.Element;
}

const variantToUiProps: Record<Variant, { variant: UiButtonVariant; tone?: ButtonTone }> = {
    primary: { variant: "primary" },
    secondary: { variant: "secondary" },
    outlined: { variant: "secondary" },
    destructive: { variant: "secondary", tone: "danger" },
    success: { variant: "primary", tone: "success" },
    textLight: { variant: "ghost" },
    textDark: { variant: "ghost" },
};

const getMobileIconNode = ({ mobileIcon, startIcon, endIcon }: Pick<ButtonOwnProps, "mobileIcon" | "startIcon" | "endIcon">) => {
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

type OwnerState = {
    variant: Variant;
    usingResponsiveBehavior: boolean;
    fullWidth: boolean;
};

export const Button = function Button({
    variant = "primary",
    size = "medium",
    responsive,
    mobileIcon = "auto",
    mobileBreakpoint = "sm",
    startIcon,
    endIcon,
    fullWidth,
    color,
    component,
    href,
    focusableWhenDisabled,
    slotProps,
    children,
    ...restProps
}: ButtonProps<ElementType>) {
    const windowSize = useWindowSize();
    const theme = useTheme();

    const mobileIconNode = getMobileIconNode({ mobileIcon, startIcon, endIcon });

    if (responsive && !mobileIconNode) {
        throw new Error("When `responsive` is true, you must provide `startIcon`, `endIcon` or `mobileIcon`.");
    }

    const ownerState: OwnerState = {
        variant,
        usingResponsiveBehavior: Boolean(responsive) && windowSize.width < theme.breakpoints.values[mobileBreakpoint],
        fullWidth: Boolean(fullWidth),
    };

    const { mobileTooltip: mobileTooltipProps, ...uiSlotProps } = slotProps ?? {};
    const commonProps = { ...variantToUiProps[variant], size, ownerState, slotProps: uiSlotProps };

    const content = ownerState.usingResponsiveBehavior ? <VisuallyHidden>{children}</VisuallyHidden> : children;
    const iconProps = ownerState.usingResponsiveBehavior ? { startIcon: mobileIconNode } : { startIcon, endIcon };

    const LinkComponent = component;
    const button =
        LinkComponent !== undefined || href !== undefined ? (
            <LinkRoot
                {...restProps}
                {...(restProps.disabled ? disabledLinkProps : undefined)}
                {...commonProps}
                {...iconProps}
                href={href}
                render={LinkComponent ? (props) => <LinkComponent {...props} /> : undefined}
            >
                {content}
            </LinkRoot>
        ) : (
            <Root {...restProps} {...commonProps} {...iconProps} focusableWhenDisabled={focusableWhenDisabled}>
                {content}
            </Root>
        );

    if (ownerState.usingResponsiveBehavior) {
        return (
            <Tooltip title={children} {...mobileTooltipProps}>
                {button}
            </Tooltip>
        );
    }

    return button;
} as ButtonComponent;

/** A link can't be disabled, so a disabled one only looks disabled and ignores clicks. */
const disabledLinkProps = {
    disabled: undefined,
    "aria-disabled": true,
    "data-disabled": "",
    tabIndex: -1,
    onClick: (event: MouseEvent) => event.preventDefault(),
};

const rootStyles = ({ ownerState }: { ownerState: OwnerState }) => css`
    ${
        ownerState.fullWidth &&
        css`
            inline-size: 100%;
        `
    }

    ${
        ownerState.variant === "textLight" &&
        css`
            --dextinity-button-ghost-foreground: var(--dextinity-app-bar-foreground);
            --dextinity-button-ghost-background-hover: var(--dextinity-app-bar-background-hover);
            --dextinity-color-focus-ring: var(--dextinity-app-bar-focus-ring);
        `
    }

    ${
        ownerState.usingResponsiveBehavior &&
        css`
            inline-size: var(--dextinity-control-height-medium);
            padding-inline: 0;

            &[data-size="small"] {
                inline-size: var(--dextinity-control-height-small);
            }

            &[data-size="large"] {
                inline-size: var(--dextinity-control-height-large);
            }
        `
    }
`;

const Root = styled(UiButton)<{ ownerState: OwnerState }>(rootStyles);

const LinkRoot = styled(UiButtonLink)<{ ownerState: OwnerState }>(rootStyles);

const VisuallyHidden = styled("span")`
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
`;
