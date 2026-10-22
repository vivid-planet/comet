"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import { clsx } from "clsx";
import type { CSSProperties, ReactNode } from "react";

import { hasContent } from "../slots/hasContent";
import { type ElementSlotProps, SlotElement } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import styles from "./Button.module.css";

/** @experimental */
export type ButtonVariant = "primary" | "secondary" | "ghost";

/** @experimental */
export type ButtonSize = "small" | "medium" | "large";

/** @experimental */
export type ButtonTone = "default" | "danger" | "success";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type ButtonOwnerState = {
    variant: ButtonVariant;
    size: ButtonSize;
    tone: ButtonTone;
    disabled: boolean;
};

/** @experimental */
export interface ButtonSlotProps {
    /** The element around `startIcon`. */
    startIcon?: SlotProps<ElementSlotProps<"span">, ButtonOwnerState>;
    /** The element around `endIcon`. */
    endIcon?: SlotProps<ElementSlotProps<"span">, ButtonOwnerState>;
}

/** @experimental */
export interface ButtonProps extends Omit<BaseButton.Props, "className" | "style" | "render" | "nativeButton"> {
    /**
     * The button's emphasis. Use `primary` for the single main action of a page or dialog, `secondary` for
     * the actions next to it, and `ghost` for less important actions, such as in a toolbar.
     *
     * @defaultValue `"primary"`
     */
    variant?: ButtonVariant;
    /**
     * The button's height, padding and text size. Use one size for all buttons in a group.
     *
     * @defaultValue `"medium"`
     */
    size?: ButtonSize;
    /**
     * Colors the button by what its action does: `danger` for an action that deletes or can't be undone, such
     * as "Delete product", `success` for an action that completes something, such as "Publish". Combine it with
     * any `variant`: a `primary` button is filled with the tone's color, a `secondary` one outlined in it. Name
     * the consequence in the label too: the color only supports it. On a tinted background, such as in an
     * `Alert`, use the `default` tone.
     *
     * @defaultValue `"default"`
     */
    tone?: ButtonTone;
    /** An icon before the text. It is decorative: the text labels the button. */
    startIcon?: ReactNode;
    /** An icon after the text, for example an arrow when the button leads to another step. */
    endIcon?: ReactNode;
    /** Prevents interaction. Use `focusableWhenDisabled` to keep the button reachable by keyboard. */
    disabled?: boolean;
    /** Added to the component's own classes. */
    className?: string;
    /** Inline styles for the button. */
    style?: CSSProperties;
    /**
     * Props for the inner parts: `startIcon` and `endIcon`. As a function, it receives the owner state:
     * `variant`, `size`, `tone` and `disabled`.
     */
    slotProps?: ButtonSlotProps;
}

/**
 * Triggers an action, such as saving a form or opening a dialog.
 *
 * Label a button with a verb that says what happens, for example "Save changes". Use one `primary` button
 * per view for its main action. A button only triggers actions: to navigate, use `ButtonLink`, a link that
 * looks like a button.
 *
 * The props the component doesn't handle, such as `type`, `onClick`, `form` and `aria-*`, go to the
 * `<button>`. Unlike a plain `<button>`, it has `type="button"` by default: set `type="submit"` on the button
 * that submits a form.
 *
 * @summary Triggers an action, in three variants, three tones and three sizes, optionally with icons.
 * @experimental
 */
export function Button({
    variant = "primary",
    size = "medium",
    tone = "default",
    startIcon,
    endIcon,
    disabled,
    className,
    slotProps,
    children,
    ...restProps
}: ButtonProps) {
    const ownerState: ButtonOwnerState = { variant, size, tone, disabled: Boolean(disabled) };

    return (
        <BaseButton
            {...restProps}
            disabled={disabled}
            data-variant={variant}
            data-size={size}
            data-tone={tone}
            className={clsx(styles.root, className)}
        >
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
