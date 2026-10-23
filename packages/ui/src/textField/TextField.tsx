"use client";

import type { Field } from "@base-ui/react/field";
import { Input } from "@base-ui/react/input";
import { clsx } from "clsx";
import type { CSSProperties, ReactNode } from "react";

import { FormField } from "../formField/FormField";
import type { ElementSlotProps } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import styles from "./TextField.module.css";

/** @experimental */
export type TextFieldType = "text" | "email" | "password" | "search" | "tel" | "url";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type TextFieldOwnerState = {
    disabled: boolean;
    required: boolean;
};

/** @experimental */
export interface TextFieldSlotProps {
    /** The `<input>` element, which receives the props the component doesn't handle. */
    input?: SlotProps<Input.Props, TextFieldOwnerState>;
    /** The `<label>` element, which holds `label` and the required indicator. */
    label?: SlotProps<Field.Label.Props, TextFieldOwnerState>;
    /** The asterisk after the label of a required field. Assistive technology skips it and learns from the input that it is required. */
    requiredIndicator?: SlotProps<ElementSlotProps<"span">, TextFieldOwnerState>;
    /** The paragraph that holds `description`. */
    description?: SlotProps<Field.Description.Props, TextFieldOwnerState>;
    /** The element that holds the error message. It is only rendered while there is an error to show. */
    error?: SlotProps<Field.Error.Props, TextFieldOwnerState>;
}

/** @experimental */
export interface TextFieldProps extends Omit<Input.Props, "className" | "style" | "render" | "children" | "type" | "disabled" | "required" | "name"> {
    /** The visible label that names the input. Keep it short and specific, for example "Email address". */
    label: ReactNode;
    /**
     * Help text below the input, such as the expected format, for example "Between 3 and 20 characters".
     * Screen readers announce it together with the label.
     */
    description?: ReactNode;
    /**
     * An error message, for example from a form library or the server. It marks the field invalid and is
     * shown below the input. Say how to fix the value, for example "Enter an email address like
     * name@example.com". Without it, the field shows the browser's message for a failed constraint, such as
     * `required`, once Base UI validates the input, for example on submit in a Base UI `Form`.
     */
    error?: ReactNode;
    /**
     * The kind of text. It picks the keyboard on touch devices and the browser's checks: `email` and `url`
     * check the format, `password` hides the characters, `search` marks the input as a search box, and `tel`
     * shows a phone keypad. For numbers, keep `text` and set `inputMode`.
     *
     * @defaultValue `"text"`
     */
    type?: TextFieldType;
    /**
     * An example value, shown while the input is empty. It disappears when the user types and doesn't replace
     * the label: put format hints into `description` instead.
     */
    placeholder?: string;
    /** Requires a value and shows an asterisk after the label. */
    required?: boolean;
    /** Prevents interaction and dims the label and the input. The description stays readable, so it can explain why. */
    disabled?: boolean;
    /** Identifies the value when a form is submitted. */
    name?: string;
    /** Added to the component's own classes on the outer element, which holds all parts. */
    className?: string;
    /** Inline styles for the outer element, which holds all parts. */
    style?: CSSProperties;
    /**
     * Props for the inner parts: `input`, `label`, `requiredIndicator`, `description` and `error`. As a
     * function, it receives the owner state: `disabled` and `required`.
     */
    slotProps?: TextFieldSlotProps;
}

/**
 * A single-line text input with a visible label, an optional description and an error message, for short
 * text such as a name, an email address or a search term.
 *
 * Label every field with `label`, which stays visible while the user types. Put format hints and other
 * instructions into `description`, not into `placeholder`, which disappears on input. Phrase an error so it
 * says how to fix the value. For fields that ask for the user's own data, set `autoComplete`, for example
 * `"email"`, so browsers can fill them in.
 *
 * Screen readers announce the description and the error message when the input receives focus. After a
 * failed submit, move focus to the first invalid field, so its error is announced. Pass errors from a form
 * library or the server as `error`.
 *
 * The props the component doesn't handle, such as `value`, `onValueChange`, `autoComplete`, `inputMode` and
 * `ref`, go to the `<input>`. For other controls, use `FormField`.
 *
 * @summary A text input with a label, an optional description and an error message.
 * @experimental
 */
export function TextField({
    label,
    description,
    error,
    type = "text",
    required,
    disabled,
    name,
    className,
    style,
    slotProps,
    ...inputProps
}: TextFieldProps) {
    const ownerState: TextFieldOwnerState = { disabled: Boolean(disabled), required: Boolean(required) };
    const { input: inputSlotProps, ...formFieldSlotProps } = slotProps ?? {};

    return (
        <FormField
            label={label}
            description={description}
            error={error}
            required={required}
            disabled={disabled}
            name={name}
            className={clsx(styles.root, className)}
            style={style}
            slotProps={formFieldSlotProps}
        >
            <Input
                {...resolveSlotProps({
                    ownProps: { ...inputProps, type, required, className: styles.input },
                    slotProps: inputSlotProps,
                    ownerState,
                })}
            />
        </FormField>
    );
}
