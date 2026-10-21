"use client";

import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { clsx } from "clsx";
import type { CSSProperties, ReactNode } from "react";

import { type ElementSlotProps, SlotElement } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import styles from "./Switch.module.css";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type SwitchOwnerState = {
    disabled: boolean;
};

/** @experimental */
export interface SwitchSlotProps {
    /** The track, which has the `switch` role and receives focus and the props the component doesn't handle. */
    control?: SlotProps<BaseSwitch.Root.Props, SwitchOwnerState>;
    /** The round handle inside the track, which moves to the end while the switch is on. */
    thumb?: SlotProps<BaseSwitch.Thumb.Props, SwitchOwnerState>;
    /** The element around `children`. */
    label?: SlotProps<ElementSlotProps<"span">, SwitchOwnerState>;
}

/** @experimental */
export interface SwitchProps extends Omit<BaseSwitch.Root.Props, "className" | "style" | "render" | "nativeButton" | "children" | "disabled" | "id"> {
    /**
     * The visible label next to the track. Clicking it toggles the switch. Without it, name the switch with
     * `aria-label` or `aria-labelledby`.
     */
    children?: ReactNode;
    /** Prevents interaction and dims the switch together with its label. */
    disabled?: boolean;
    /** The id of the hidden `<input>` element that submits the switch's value with a form. */
    id?: string;
    /** Added to the component's own classes on the outer `<label>` element, which holds the track and the label. */
    className?: string;
    /** Inline styles for the outer `<label>` element, which holds the track and the label. */
    style?: CSSProperties;
    /** Props for the inner parts: `control` (the track), `thumb` (the handle) and `label` (the element around `children`). */
    slotProps?: SwitchSlotProps;
}

/**
 * Turns a setting on or off with immediate effect, such as email notifications or a dark mode.
 *
 * Pass the label as `children`, phrased as the setting it turns on, for example "Email notifications".
 * Clicking the label toggles the switch too. Without a visible label, name the switch with `aria-label` or
 * `aria-labelledby`. Use a switch only where the change applies right away, without a save button: in a form
 * that is submitted, use `Checkbox` instead.
 *
 * The props the component doesn't handle, such as `checked`, `onCheckedChange`, `name` and `aria-label`, go
 * to the track.
 *
 * @summary A switch with an optional label, for settings that take effect immediately.
 * @experimental
 */
export function Switch({ disabled, className, style, slotProps, children, ...controlProps }: SwitchProps) {
    const ownerState: SwitchOwnerState = { disabled: Boolean(disabled) };

    return (
        <label className={clsx(styles.root, className)} style={style} data-disabled={ownerState.disabled ? "" : undefined}>
            <BaseSwitch.Root
                {...resolveSlotProps({
                    ownProps: { ...controlProps, disabled, className: styles.control },
                    slotProps: slotProps?.control,
                    ownerState,
                })}
            >
                <BaseSwitch.Thumb {...resolveSlotProps({ ownProps: { className: styles.thumb }, slotProps: slotProps?.thumb, ownerState })} />
            </BaseSwitch.Root>
            {children != null && (
                <SlotElement tagName="span" {...resolveSlotProps({ ownProps: { className: styles.label }, slotProps: slotProps?.label, ownerState })}>
                    {children}
                </SlotElement>
            )}
        </label>
    );
}
