"use client";

import { clsx } from "clsx";
import type { ReactNode } from "react";

import { Button, type ButtonProps, type ButtonSize, type ButtonVariant } from "../button/Button";
import { type ElementSlotProps, SlotElement } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import styles from "./IconButton.module.css";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type IconButtonOwnerState = {
    variant: ButtonVariant;
    size: ButtonSize;
    disabled: boolean;
};

/** @experimental */
export interface IconButtonSlotProps {
    /** The element around the icon. */
    icon?: SlotProps<ElementSlotProps<"span">, IconButtonOwnerState>;
}

/** @experimental */
export interface IconButtonProps extends Omit<ButtonProps, "startIcon" | "endIcon" | "slotProps" | "children" | "aria-label"> {
    /**
     * The button's accessible name, which screen readers announce in place of the icon. Name the action, and
     * the item when the page has several of them: "Delete product" rather than "Delete".
     */
    label: string;
    /** The icon. It is decorative: `label` names the button. */
    children: ReactNode;
    /**
     * The button's emphasis. `ghost` suits toolbars and table rows, where several icon buttons sit side by
     * side. Use `secondary` for an icon button on its own, and `primary` only for the main action of a view.
     *
     * @defaultValue `"ghost"`
     */
    variant?: ButtonVariant;
    /**
     * The button's width and height, which are equal, and its icon size. Use one size for all buttons in a group.
     *
     * @defaultValue `"medium"`
     */
    size?: ButtonSize;
    /** Props for the inner part: `icon`, the element around the icon. */
    slotProps?: IconButtonSlotProps;
}

/**
 * A button that shows only an icon, for compact places such as toolbars and table rows.
 *
 * Use it only when space is tight and the icon is widely understood, such as a pencil for editing or a
 * trash can for deleting. Otherwise, use a `Button` with text, which needs no guessing.
 *
 * `label` is required: the icon gives the button no accessible name. The button doesn't show the label as a
 * tooltip yet, so sighted users only see the icon.
 *
 * @summary A square button with only an icon, named by a required label.
 * @experimental
 */
export function IconButton({ label, variant = "ghost", size = "medium", disabled, className, slotProps, children, ...restProps }: IconButtonProps) {
    const ownerState: IconButtonOwnerState = { variant, size, disabled: Boolean(disabled) };

    return (
        <Button {...restProps} aria-label={label} variant={variant} size={size} disabled={disabled} className={clsx(styles.root, className)}>
            <SlotElement
                tagName="span"
                {...resolveSlotProps({ ownProps: { className: styles.icon, "aria-hidden": true }, slotProps: slotProps?.icon, ownerState })}
            >
                {children}
            </SlotElement>
        </Button>
    );
}
