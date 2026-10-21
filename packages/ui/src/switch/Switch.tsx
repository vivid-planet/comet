"use client";

import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { clsx } from "clsx";
import type { CSSProperties, ReactNode } from "react";

import { hasContent } from "../slots/hasContent";
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
     * `aria-label`, with `aria-labelledby`, or with a `<label>` whose `htmlFor` matches its `id`.
     */
    children?: ReactNode;
    /** Prevents interaction and dims the switch together with its label. */
    disabled?: boolean;
    /** The id of the hidden `<input>` element that submits the switch's value with a form. */
    id?: string;
    /** Added to the component's own classes on the outer element, which holds the track and the label. */
    className?: string;
    /** Inline styles for the outer element, which holds the track and the label. */
    style?: CSSProperties;
    /**
     * Props for the inner parts: `control` (the track), `thumb` (the handle) and `label` (the element around `children`). As a function, it receives the owner
     * state: `disabled`.
     */
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
    const hasLabel = hasContent(children);
    // Without a label of its own, a <label> wrapper would hide an external <label htmlFor> from Base UI's labelling.
    const RootElement = hasLabel ? "label" : "span";

    return (
        <RootElement className={clsx(styles.root, className)} style={style} data-disabled={ownerState.disabled ? "" : undefined}>
            <BaseSwitch.Root
                {...resolveSlotProps({
                    ownProps: { ...controlProps, disabled, className: styles.control },
                    slotProps: slotProps?.control,
                    ownerState,
                })}
            >
                <BaseSwitch.Thumb {...resolveSlotProps({ ownProps: { className: styles.thumb }, slotProps: slotProps?.thumb, ownerState })} />
            </BaseSwitch.Root>
            {hasLabel && (
                <SlotElement tagName="span" {...resolveSlotProps({ ownProps: { className: styles.label }, slotProps: slotProps?.label, ownerState })}>
                    {children}
                </SlotElement>
            )}
        </RootElement>
    );
}
