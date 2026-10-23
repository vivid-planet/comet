"use client";

import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { clsx } from "clsx";
import { type CSSProperties, type ReactNode, useId } from "react";

import { hasContent } from "../slots/hasContent";
import { type ElementSlotProps, SlotElement } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import styles from "./Checkbox.module.css";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type CheckboxOwnerState = {
    disabled: boolean;
};

/** @experimental */
export interface CheckboxSlotProps {
    /** The box, which has the `checkbox` role and receives focus and the props the component doesn't handle. */
    control?: SlotProps<BaseCheckbox.Root.Props, CheckboxOwnerState>;
    /** The mark inside the box: a check mark, or a dash while indeterminate. Rendered only while checked or indeterminate. */
    indicator?: SlotProps<BaseCheckbox.Indicator.Props, CheckboxOwnerState>;
    /** The `<label>` element around `children`, which names the checkbox. */
    label?: SlotProps<ElementSlotProps<"label">, CheckboxOwnerState>;
}

/** @experimental */
export interface CheckboxProps extends Omit<
    BaseCheckbox.Root.Props,
    "className" | "style" | "render" | "nativeButton" | "children" | "disabled" | "id"
> {
    /**
     * The visible label next to the box. Clicking it toggles the checkbox. Without it, name the checkbox with
     * `aria-label`, with `aria-labelledby`, or with a `<label>` whose `htmlFor` matches its `id`.
     */
    children?: ReactNode;
    /** The id of the hidden `<input>` element that submits the checkbox's value with a form. A `<label>` elsewhere names the checkbox with a matching `htmlFor`. */
    id?: string;
    /** Prevents interaction and dims the checkbox together with its label. */
    disabled?: boolean;
    /** Added to the component's own classes on the outer element, which holds the box and the label. */
    className?: string;
    /** Inline styles for the outer element, which holds the box and the label. */
    style?: CSSProperties;
    /**
     * Props for the inner parts: `control` (the box), `indicator` (the mark inside it) and `label` (the element around `children`). As a function, it receives the owner
     * state: `disabled`.
     */
    slotProps?: CheckboxSlotProps;
}

/**
 * Turns an option on or off in a form that is submitted, such as accepting terms or subscribing to a newsletter.
 * Several checkboxes let the user pick any number of options from a list.
 *
 * Pass the label as `children`, phrased as the option that is turned on, for example "Subscribe to the
 * newsletter". Clicking the label toggles the checkbox too. Without a visible label, for example in a table
 * row, name the checkbox with `aria-label` or `aria-labelledby`. Use `indeterminate` for a checkbox that
 * selects a group of options while only some of them are selected. For a setting that takes effect
 * immediately, use `Switch` instead.
 *
 * The props the component doesn't handle, such as `checked`, `onCheckedChange`, `name` and `aria-label`, go
 * to the box.
 *
 * @summary A checkbox with an optional label, for options in a form that is submitted.
 * @experimental
 */
export function Checkbox({ id, disabled, className, style, slotProps, children, ...controlProps }: CheckboxProps) {
    const ownerState: CheckboxOwnerState = { disabled: Boolean(disabled) };
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
        <span className={clsx(styles.root, className)} style={style} data-disabled={ownerState.disabled ? "" : undefined}>
            <BaseCheckbox.Root
                {...resolveSlotProps({
                    ownProps: { ...controlProps, id: inputId, disabled, className: styles.control },
                    slotProps: slotProps?.control,
                    ownerState,
                })}
            >
                <BaseCheckbox.Indicator
                    {...resolveSlotProps({ ownProps: { className: styles.indicator }, slotProps: slotProps?.indicator, ownerState })}
                >
                    <svg
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                    >
                        <path className={styles.checkMark} d="M2.5 6.5 5 9l4.5-6" />
                        <path className={styles.indeterminateMark} d="M3 6h6" />
                    </svg>
                </BaseCheckbox.Indicator>
            </BaseCheckbox.Root>
            {hasContent(children) && (
                <SlotElement
                    tagName="label"
                    {...resolveSlotProps({ ownProps: { className: styles.label, htmlFor: inputId }, slotProps: slotProps?.label, ownerState })}
                >
                    {children}
                </SlotElement>
            )}
        </span>
    );
}
