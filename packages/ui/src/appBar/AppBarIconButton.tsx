"use client";

import { clsx } from "clsx";
import type { ReactNode } from "react";

import { type ElementSlotProps, SlotElement } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import { AppBarButton, type AppBarButtonProps } from "./AppBarButton";
import styles from "./AppBarIconButton.module.css";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type AppBarIconButtonOwnerState = {
    disabled: boolean;
};

/** @experimental */
export interface AppBarIconButtonSlotProps {
    /** The element around the icon. */
    icon?: SlotProps<ElementSlotProps<"span">, AppBarIconButtonOwnerState>;
}

/** @experimental */
export interface AppBarIconButtonProps extends Omit<AppBarButtonProps, "startIcon" | "endIcon" | "slotProps" | "children" | "aria-label"> {
    /**
     * The button's accessible name, which screen readers announce in place of the icon, for example
     * "Open navigation" or "Notifications".
     */
    label: string;
    /** The icon. It is decorative: `label` names the button. */
    children: ReactNode;
    /** Props for the inner part: `icon`, the element around the icon. As a function, it receives the owner state: `disabled`. */
    slotProps?: AppBarIconButtonSlotProps;
}

/**
 * A square button on an `AppBar` that shows only an icon, such as the button that opens the navigation or the
 * notifications. Use it only inside an `AppBar`: elsewhere, use `IconButton`.
 *
 * Use it for widely understood icons, such as a bell for notifications. `label` is required: the icon gives
 * the button no accessible name.
 *
 * The props the component doesn't handle, such as `onClick` and `aria-*`, go to the `<button>`, which has
 * `type="button"` by default.
 *
 * @summary A square app bar button with only an icon, named by a required label.
 * @experimental
 */
export function AppBarIconButton({ label, disabled, className, slotProps, children, ...buttonProps }: AppBarIconButtonProps) {
    const ownerState: AppBarIconButtonOwnerState = { disabled: Boolean(disabled) };

    return (
        <AppBarButton {...buttonProps} aria-label={label} disabled={disabled} className={clsx(styles.root, className)}>
            <SlotElement
                tagName="span"
                {...resolveSlotProps({ ownProps: { className: styles.icon, "aria-hidden": true }, slotProps: slotProps?.icon, ownerState })}
            >
                {children}
            </SlotElement>
        </AppBarButton>
    );
}
