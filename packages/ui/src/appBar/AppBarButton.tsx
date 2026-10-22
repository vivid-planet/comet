"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import { clsx } from "clsx";
import type { CSSProperties, ReactNode } from "react";

import { hasContent } from "../slots/hasContent";
import { type ElementSlotProps, SlotElement } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import styles from "./AppBarButton.module.css";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type AppBarButtonOwnerState = {
    disabled: boolean;
};

/** @experimental */
export interface AppBarButtonSlotProps {
    /** The element around `startIcon`. */
    startIcon?: SlotProps<ElementSlotProps<"span">, AppBarButtonOwnerState>;
    /** The element around `endIcon`. */
    endIcon?: SlotProps<ElementSlotProps<"span">, AppBarButtonOwnerState>;
}

/** @experimental */
export interface AppBarButtonProps extends Omit<BaseButton.Props, "className" | "style" | "render" | "nativeButton"> {
    /**
     * An icon or an `Avatar` before the text, for example the user's picture on the button that opens the user
     * menu. It is decorative: the text labels the button.
     */
    startIcon?: ReactNode;
    /** An icon after the text, for example a chevron on a button that opens a `Menu`. */
    endIcon?: ReactNode;
    /** Prevents interaction. Use `focusableWhenDisabled` to keep the button reachable by keyboard. */
    disabled?: boolean;
    /** Added to the component's own classes. */
    className?: string;
    /** Inline styles for the button. */
    style?: CSSProperties;
    /** Props for the inner parts: `startIcon` and `endIcon`. As a function, it receives the owner state: `disabled`. */
    slotProps?: AppBarButtonSlotProps;
}

/**
 * A button on an `AppBar`, in the app bar's colors, for an application-wide action, such as opening the
 * preview, or for opening a `Menu`, such as the user menu. Use it only inside an `AppBar`: elsewhere, use
 * `Button`.
 *
 * Label it with a short text; for a button that shows only an icon, use `AppBarIconButton`. As a `Menu`'s
 * `trigger`, give it an `endIcon` such as a chevron, which shows that it opens a menu; while the menu is open,
 * the button keeps its hover background. A button only triggers actions: navigate with a link instead.
 *
 * The props the component doesn't handle, such as `onClick` and `aria-*`, go to the `<button>`, which has
 * `type="button"` by default.
 *
 * @summary A button in the app bar's colors, optionally with icons.
 * @experimental
 */
export function AppBarButton({ startIcon, endIcon, disabled, className, slotProps, children, ...buttonProps }: AppBarButtonProps) {
    const ownerState: AppBarButtonOwnerState = { disabled: Boolean(disabled) };

    return (
        <BaseButton {...buttonProps} disabled={disabled} className={clsx(styles.root, className)}>
            {hasContent(startIcon) && (
                <SlotElement
                    tagName="span"
                    {...resolveSlotProps({
                        ownProps: { className: styles.startIcon, "aria-hidden": true },
                        slotProps: slotProps?.startIcon,
                        ownerState,
                    })}
                >
                    {startIcon}
                </SlotElement>
            )}
            {children}
            {hasContent(endIcon) && (
                <SlotElement
                    tagName="span"
                    {...resolveSlotProps({ ownProps: { className: styles.endIcon, "aria-hidden": true }, slotProps: slotProps?.endIcon, ownerState })}
                >
                    {endIcon}
                </SlotElement>
            )}
        </BaseButton>
    );
}
