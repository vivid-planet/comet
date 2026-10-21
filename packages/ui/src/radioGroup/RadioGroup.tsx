"use client";

import { Field as BaseField } from "@base-ui/react/field";
import { Fieldset as BaseFieldset } from "@base-ui/react/fieldset";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { clsx } from "clsx";
import type { ReactNode } from "react";

import { type ElementSlotProps, SlotElement } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import styles from "./RadioGroup.module.css";
import { RadioGroupDisabledContext } from "./radioGroupContext";

/** @experimental */
export type RadioGroupOrientation = "vertical" | "horizontal";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type RadioGroupOwnerState = {
    orientation: RadioGroupOrientation;
    disabled: boolean;
    required: boolean;
};

/** @experimental */
export interface RadioGroupSlotProps {
    /** The element around `label` and the required indicator, which names the group. */
    label?: SlotProps<BaseFieldset.Legend.Props, RadioGroupOwnerState>;
    /** The asterisk after the label of a required group. Assistive technology skips it and learns from the group that it is required. */
    requiredIndicator?: SlotProps<ElementSlotProps<"span">, RadioGroupOwnerState>;
    /** The element around the `Radio` options. */
    options?: SlotProps<ElementSlotProps<"div">, RadioGroupOwnerState>;
    /** The element around `description`. */
    description?: SlotProps<BaseField.Description.Props, RadioGroupOwnerState>;
    /** The element that holds the error message. It is only rendered while there is an error to show. */
    error?: SlotProps<BaseField.Error.Props, RadioGroupOwnerState>;
}

/** @experimental */
export interface RadioGroupProps<Value = unknown> extends Omit<
    BaseRadioGroup.Props<Value>,
    "className" | "render" | "children" | "disabled" | "required"
> {
    /** The group's visible name, for example "Shipping method". It also names the group for assistive technology. */
    label: ReactNode;
    /** Help text below the options, for example what the choice affects. Assistive technology reads it with the group. */
    description?: ReactNode;
    /**
     * An error message below the options. While it is set, the group is invalid: the options show the error
     * state and assistive technology reads the message with the group. Use it for errors your application
     * determines, for example from a form library or the server. Without it, the group shows the browser's
     * message for a missing selection once Base UI validates `required`, for example on submit in a Base UI `Form`.
     */
    error?: ReactNode;
    /**
     * How the options are laid out. Use `horizontal` only for a few short options, such as "Yes" and "No";
     * the options wrap onto further lines when space runs out.
     *
     * @defaultValue `"vertical"`
     */
    orientation?: RadioGroupOrientation;
    /** The options, as `Radio` elements. */
    children?: ReactNode;
    /** Prevents interaction with all options and dims them. To disable a single option, use `disabled` on its `Radio`. */
    disabled?: boolean;
    /**
     * Marks the group as required: an asterisk follows the label, and assistive technology announces it.
     * Together with `name`, it also prevents submitting the form before an option is selected.
     */
    required?: boolean;
    /** Added to the component's own classes. */
    className?: string;
    /** Props for the inner parts: `label`, `requiredIndicator`, `options` (the element around the options), `description` and `error`. */
    slotProps?: RadioGroupSlotProps;
}

/**
 * Lets the user pick exactly one option from a short list, such as a shipping method or a payment plan. All
 * options are visible at once, so a group suits up to about seven options. For a single option that is on or
 * off, use `Checkbox` or `Switch` instead.
 *
 * Pass the options as `Radio` children and name the group with `label`. Tab moves focus into the group, to the
 * selected option, and the arrow keys move the selection between the options. Add `description` for help text
 * and `error` for a validation message; assistive technology reads both with the group.
 *
 * The props the component doesn't handle, such as `value`, `onValueChange` and `name`, go to the root
 * element, which has the `radiogroup` role.
 *
 * @summary A labelled group of radio options, with an optional description and error message.
 * @experimental
 */
export function RadioGroup<Value>({
    label,
    description,
    error,
    orientation = "vertical",
    disabled,
    required,
    className,
    slotProps,
    children,
    ...radioGroupProps
}: RadioGroupProps<Value>) {
    const ownerState: RadioGroupOwnerState = { orientation, disabled: Boolean(disabled), required: Boolean(required) };
    const hasError = hasContent(error);

    return (
        <RadioGroupDisabledContext value={ownerState.disabled}>
            <BaseField.Root
                invalid={hasError}
                disabled={disabled}
                render={
                    <BaseFieldset.Root
                        render={
                            <BaseRadioGroup
                                {...radioGroupProps}
                                required={required}
                                data-orientation={orientation}
                                className={clsx(styles.root, className)}
                            />
                        }
                    />
                }
            >
                <BaseFieldset.Legend {...resolveSlotProps({ ownProps: { className: styles.label }, slotProps: slotProps?.label, ownerState })}>
                    {label}
                    {ownerState.required && (
                        <SlotElement
                            tagName="span"
                            {...resolveSlotProps({
                                ownProps: { className: styles.requiredIndicator, "aria-hidden": true, children: "*" },
                                slotProps: slotProps?.requiredIndicator,
                                ownerState,
                            })}
                        />
                    )}
                </BaseFieldset.Legend>
                <SlotElement
                    tagName="div"
                    {...resolveSlotProps({ ownProps: { className: styles.options }, slotProps: slotProps?.options, ownerState })}
                >
                    {children}
                </SlotElement>
                {hasContent(description) && (
                    <BaseField.Description
                        {...resolveSlotProps({ ownProps: { className: styles.description }, slotProps: slotProps?.description, ownerState })}
                    >
                        {description}
                    </BaseField.Description>
                )}
                <BaseField.Error
                    {...resolveSlotProps({
                        ownProps: hasError ? { className: styles.error, match: true, children: error } : { className: styles.error },
                        slotProps: slotProps?.error,
                        ownerState,
                    })}
                />
            </BaseField.Root>
        </RadioGroupDisabledContext>
    );
}

/** Form libraries pass `false` or `""` for "no message", as in `error={touched && message}`. */
function hasContent(node: ReactNode) {
    return node != null && typeof node !== "boolean" && node !== "";
}
