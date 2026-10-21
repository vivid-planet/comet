"use client";

import { Field } from "@base-ui/react/field";
import { clsx } from "clsx";
import type { CSSProperties, ReactNode } from "react";

import { hasContent } from "../slots/hasContent";
import { type ElementSlotProps, SlotElement } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import styles from "./FormField.module.css";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type FormFieldOwnerState = {
    disabled: boolean;
    required: boolean;
};

/** @experimental */
export interface FormFieldSlotProps {
    /** The `<label>` element, which holds `label` and the required indicator. */
    label?: SlotProps<Field.Label.Props, FormFieldOwnerState>;
    /** The asterisk after the label of a required field. Assistive technology skips it and learns from the control that it is required. */
    requiredIndicator?: SlotProps<ElementSlotProps<"span">, FormFieldOwnerState>;
    /** The paragraph that holds `description`. */
    description?: SlotProps<Field.Description.Props, FormFieldOwnerState>;
    /** The element that holds the error message. It is only rendered while there is an error to show. */
    error?: SlotProps<Field.Error.Props, FormFieldOwnerState>;
}

/** @experimental */
export interface FormFieldProps extends Omit<Field.Root.Props, "className" | "style" | "render" | "children" | "disabled"> {
    /** The visible label that names the control. Keep it short and specific, for example "Company name". */
    label: ReactNode;
    /**
     * Help text below the control, such as the expected format or why the information is needed. Screen
     * readers announce it together with the label.
     */
    description?: ReactNode;
    /**
     * An error message, for example from a form library or the server. It marks the field invalid and is
     * shown below the control. Say how to fix the value, for example "Enter a company name". Without it, the
     * field shows the browser's message for a failed constraint, such as `required`, once Base UI validates
     * the control (see `validationMode`).
     */
    error?: ReactNode;
    /**
     * Shows an asterisk after the label. It doesn't make the control required: set `required` on the control
     * too, so the browser and assistive technology know. `TextField` does both.
     */
    required?: boolean;
    /** Prevents interaction with the control and dims the label. The description stays readable, so it can explain why. */
    disabled?: boolean;
    /** Added to the component's own classes on the outer element, which holds all parts. */
    className?: string;
    /** Inline styles for the outer element, which holds all parts. */
    style?: CSSProperties;
    /**
     * Props for the inner parts: `label`, `requiredIndicator`, `description` and `error`. As a function, it
     * receives the owner state: `disabled` and `required`.
     */
    slotProps?: FormFieldSlotProps;
    /**
     * The control: a Base UI form control, such as `Input` from `@base-ui/react/input`, or `Field.Control`
     * from `@base-ui/react/field` with `render` for a native element like `<select>`. A plain HTML element
     * isn't connected to the label, description and error. The control must come from the same copy of
     * `@base-ui/react` as `@dextinity/ui`'s: install the version its peer dependency names.
     */
    children: ReactNode;
}

/**
 * The frame of a form field: a visible label, the control, an optional description and an error message,
 * connected to the control for assistive technology.
 *
 * Use it to give a control that has no field of its own a label, a description and an error, for example a
 * native `<select>` or a custom control built on Base UI. For text input, use `TextField`, which builds on
 * `FormField`.
 *
 * The label names the control, and screen readers announce the description and the error message when the
 * control receives focus. After a failed submit, move focus to the first invalid field, so its error is
 * announced. Pass errors from a form library or the server as `error`. Without it, the field shows the
 * browser's message for a failed constraint, in the browser's language.
 *
 * The props the component doesn't handle, such as `name`, `validate` and `validationMode`, go to Base UI's
 * `Field.Root`.
 *
 * @summary The label, description and error message around a form control.
 * @experimental
 */
export function FormField({
    label,
    description,
    error,
    required,
    disabled,
    invalid,
    className,
    style,
    slotProps,
    children,
    ...rootProps
}: FormFieldProps) {
    const ownerState: FormFieldOwnerState = { disabled: Boolean(disabled), required: Boolean(required) };
    const hasError = hasContent(error);

    return (
        <Field.Root
            {...rootProps}
            disabled={disabled}
            invalid={hasError || invalid}
            data-required={ownerState.required ? "" : undefined}
            className={clsx(styles.root, className)}
            style={style}
        >
            <Field.Label {...resolveSlotProps({ ownProps: { className: styles.label }, slotProps: slotProps?.label, ownerState })}>
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
            </Field.Label>
            {children}
            {hasContent(description) && (
                <Field.Description
                    {...resolveSlotProps({ ownProps: { className: styles.description }, slotProps: slotProps?.description, ownerState })}
                >
                    {description}
                </Field.Description>
            )}
            <Field.Error
                {...resolveSlotProps({
                    ownProps: hasError ? { className: styles.error, match: true, children: error } : { className: styles.error },
                    slotProps: slotProps?.error,
                    ownerState,
                })}
            />
        </Field.Root>
    );
}
