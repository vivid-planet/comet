"use client";

import { Field as BaseField } from "@base-ui/react/field";
import { Radio as BaseRadio } from "@base-ui/react/radio";
import { clsx } from "clsx";
import { type CSSProperties, type ReactNode, use } from "react";

import { hasContent } from "../slots/hasContent";
import { type ElementSlotProps, SlotElement } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import styles from "./Radio.module.css";
import { RadioGroupDisabledContext } from "./radioGroupContext";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type RadioOwnerState = {
    /** Whether the option is disabled by its own `disabled` prop or by the RadioGroup's `disabled` prop. */
    disabled: boolean;
};

/** @experimental */
export interface RadioSlotProps {
    /** The circle, which has the `radio` role and receives focus and the props the component doesn't handle. */
    control?: SlotProps<Omit<BaseRadio.Root.Props, "value">, RadioOwnerState>;
    /** The dot inside the circle. Rendered only while the option is selected. */
    indicator?: SlotProps<BaseRadio.Indicator.Props, RadioOwnerState>;
    /** The element around `children`. */
    label?: SlotProps<ElementSlotProps<"span">, RadioOwnerState>;
}

/** @experimental */
export interface RadioProps<Value = unknown> extends Omit<
    BaseRadio.Root.Props<Value>,
    "className" | "style" | "render" | "nativeButton" | "children" | "disabled" | "id"
> {
    /** The value the group takes while this option is selected. Unique within the group. */
    value: Value;
    /**
     * The option's visible label next to the circle. Clicking it selects the option. Without it, name the
     * option with `aria-label` or `aria-labelledby`.
     */
    children?: ReactNode;
    /** Prevents selecting this option and dims it. Prefer leaving out an option that never applies. */
    disabled?: boolean;
    /** The id of the hidden `<input>` element that submits the option's value with a form. */
    id?: string;
    /** Added to the component's own classes on the outer `<label>` element, which holds the circle and the label. */
    className?: string;
    /** Inline styles for the outer `<label>` element, which holds the circle and the label. */
    style?: CSSProperties;
    /**
     * Props for the inner parts: `control` (the circle), `indicator` (the dot) and `label` (the element around
     * `children`). As a function, it receives the owner state: `disabled`.
     */
    slotProps?: RadioSlotProps;
}

/**
 * One option of a `RadioGroup`. Use it only as a child of `RadioGroup`, which holds the selected value, the
 * form name and the validation state.
 *
 * Pass the option's label as `children`; clicking the label selects the option too. Keep labels short and
 * parallel, and order the options logically, for example from slowest to fastest. Without a visible label,
 * for example for color swatches, name the option with `aria-label`.
 *
 * The props the component doesn't handle, such as `aria-label` and `inputRef`, go to the circle.
 *
 * @summary One option of a `RadioGroup`, with a visible label.
 * @experimental
 */
export function Radio<Value>({ value, disabled, className, style, slotProps, children, ...controlProps }: RadioProps<Value>) {
    const isGroupDisabled = use(RadioGroupDisabledContext);
    const ownerState: RadioOwnerState = { disabled: Boolean(disabled) || isGroupDisabled };

    return (
        <BaseField.Item disabled={disabled} className={clsx(styles.root, className)} style={style} render={<BaseField.Label />}>
            <BaseRadio.Root
                {...resolveSlotProps({ ownProps: { ...controlProps, className: styles.control }, slotProps: slotProps?.control, ownerState })}
                value={value}
            >
                <BaseRadio.Indicator
                    {...resolveSlotProps({ ownProps: { className: styles.indicator }, slotProps: slotProps?.indicator, ownerState })}
                />
            </BaseRadio.Root>
            {hasContent(children) && (
                <SlotElement tagName="span" {...resolveSlotProps({ ownProps: { className: styles.label }, slotProps: slotProps?.label, ownerState })}>
                    {children}
                </SlotElement>
            )}
        </BaseField.Item>
    );
}
