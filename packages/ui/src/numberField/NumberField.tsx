"use client";

import type { Field } from "@base-ui/react/field";
import { NumberField as BaseNumberField, type NumberFieldRootChangeEventDetails } from "@base-ui/react/number-field";
import { clsx } from "clsx";
import type { CSSProperties, ReactNode } from "react";

import { FormField, type FormFieldSlotProps } from "../formField/FormField";
import { Icon } from "../icon/Icon";
import type { ElementSlotProps } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import styles from "./NumberField.module.css";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type NumberFieldOwnerState = {
    disabled: boolean;
    required: boolean;
    readonly: boolean;
};

/** @experimental */
export interface NumberFieldSlotProps {
    /** The box around the input and the two buttons, which draws the border. It has the `group` role. */
    group?: SlotProps<BaseNumberField.Group.Props, NumberFieldOwnerState>;
    /** The `<input>` element, which shows the formatted value, receives focus and the props the component doesn't handle. */
    input?: SlotProps<BaseNumberField.Input.Props, NumberFieldOwnerState>;
    /** The button that decreases the value by `step`. Its `children`, the `minus` icon, can be replaced. */
    decrement?: SlotProps<BaseNumberField.Decrement.Props, NumberFieldOwnerState>;
    /** The button that increases the value by `step`. Its `children`, the `plus` icon, can be replaced. */
    increment?: SlotProps<BaseNumberField.Increment.Props, NumberFieldOwnerState>;
    /** The `<label>` element, which holds `label` and the required indicator. */
    label?: SlotProps<Field.Label.Props, NumberFieldOwnerState>;
    /** The asterisk after the label of a required field. Assistive technology skips it and learns from the input that it is required. */
    requiredIndicator?: SlotProps<ElementSlotProps<"span">, NumberFieldOwnerState>;
    /** The paragraph that holds `description`. */
    description?: SlotProps<Field.Description.Props, NumberFieldOwnerState>;
    /** The element that holds the error message. It is only rendered while there is an error to show. */
    error?: SlotProps<Field.Error.Props, NumberFieldOwnerState>;
}

/** @experimental */
export interface NumberFieldProps
    extends
        Omit<
            BaseNumberField.Input.Props,
            | "className"
            | "style"
            | "render"
            | "children"
            | "type"
            | "value"
            | "defaultValue"
            | "min"
            | "max"
            | "step"
            | "disabled"
            | "required"
            | "readOnly"
            | "name"
            | "form"
            | "id"
            | "aria-roledescription"
        >,
        Pick<
            BaseNumberField.Root.Props,
            "id" | "form" | "locale" | "largeStep" | "smallStep" | "snapOnStep" | "allowOutOfRange" | "allowWheelScrub" | "onValueCommitted"
        > {
    /** The visible label that names the input. Keep it short and specific, for example "Number of guests". */
    label: ReactNode;
    /**
     * Help text below the input, such as the allowed range or the unit, for example "Between 1 and 12 guests".
     * Screen readers announce it together with the label.
     */
    description?: ReactNode;
    /**
     * An error message, for example from a form library or the server. It marks the field invalid and is
     * shown below the input. Say how to fix the value, for example "Enter at most 12 guests". Without it, the
     * field shows the browser's message for a failed constraint, such as `required`, once Base UI validates
     * the input, for example on submit in a Base UI `Form`.
     */
    error?: ReactNode;
    /** The value, when your application controls it. `null` empties the input. Update it in `onValueChange`. */
    value?: number | null;
    /** The initial value of a field that keeps its value itself. Leave it out, or pass `null`, for an empty input. */
    defaultValue?: number | null;
    /**
     * Called with the new value, or `null` once the input is emptied. It runs while the user types a number,
     * steps with the arrow keys or the buttons, and when the input loses focus and the typed value is
     * rounded or clamped.
     */
    onValueChange?: (value: number | null, eventDetails: NumberFieldRootChangeEventDetails) => void;
    /** The smallest allowed value. Stepping stops there, and a typed value is clamped to it when the input loses focus. */
    min?: number;
    /** The largest allowed value. Stepping stops there, and a typed value is clamped to it when the input loses focus. */
    max?: number;
    /**
     * The amount that the arrow keys and the buttons add or subtract. Shift steps by 10 and Alt by 0.1, unless
     * `largeStep` and `smallStep` say otherwise.
     *
     * @defaultValue `1`
     */
    step?: number | "any";
    /**
     * How the value is shown, as options of `Intl.NumberFormat`, for example `{ style: "currency", currency:
     * "EUR" }` or `{ maximumFractionDigits: 2 }`. The input formats the value in the user's locale, or in
     * `locale`, and still accepts plain digits.
     */
    format?: Intl.NumberFormatOptions;
    /**
     * The accessible name of the button that decreases the value, for example "Decrease guests". Without it,
     * assistive technology skips the button: keyboard users change the value with the arrow keys, and screen
     * reader users type it. Set it together with `incrementLabel` so that screen reader users on touch
     * devices can use the buttons too.
     */
    decrementLabel?: string;
    /**
     * The accessible name of the button that increases the value, for example "Increase guests". Without it,
     * assistive technology skips the button. See `decrementLabel`.
     */
    incrementLabel?: string;
    /**
     * Describes the input's role in the user's language, for example "Zahlenfeld". The input has no role
     * description without it.
     */
    "aria-roledescription"?: string;
    /**
     * An example value, shown while the input is empty, for example "0". It disappears when the user types and
     * doesn't replace the label: say the range or the unit in `description` instead.
     */
    placeholder?: string;
    /** Requires a value and shows an asterisk after the label. */
    required?: boolean;
    /** Prevents interaction and dims the label and the input. The description stays readable, so it can explain why. */
    disabled?: boolean;
    /** Shows the value without letting the user change it, and hides the buttons. The input still receives focus, so the value can be selected and copied. */
    readOnly?: boolean;
    /** Identifies the value when a form is submitted. The form receives the number without formatting, such as `1234.5`. */
    name?: string;
    /** Added to the component's own classes on the outer element, which holds all parts. */
    className?: string;
    /** Inline styles for the outer element, which holds all parts. */
    style?: CSSProperties;
    /**
     * Props for the inner parts: `group` (the box with the border), `input`, `decrement`, `increment`,
     * `label`, `requiredIndicator`, `description` and `error`. As a function, it receives the owner state:
     * `disabled`, `required` and `readonly`.
     */
    slotProps?: NumberFieldSlotProps;
}

/**
 * A form field for a number, such as a quantity, a price or a percentage, with buttons that step the value
 * up and down.
 *
 * Label every field with `label`, and say the allowed range or the unit in `description`. Set `min` and
 * `max` to keep the value in range, `step` for the amount the arrow keys and buttons change it by, and
 * `format` to show it as a currency, a percentage or with a fixed number of decimals. For a number that
 * isn't an amount, such as a postal code or a phone number, use `TextField` with `inputMode="numeric"`.
 *
 * The user types the number, or presses ArrowUp and ArrowDown to step it; Home and End jump to `min` and
 * `max`. The buttons inside the border are for pointer and touch users: Tab skips them, and assistive
 * technology does too unless you name them with `decrementLabel` and `incrementLabel`. The input doesn't
 * announce a role description of its own; pass one in the user's language with `aria-roledescription` if
 * you need it.
 *
 * The props the component doesn't handle, such as `placeholder`, `autoFocus`, `aria-describedby`, event
 * handlers and `ref`, go to the `<input>`. The number settings `locale`, `largeStep`, `smallStep`,
 * `snapOnStep`, `allowOutOfRange`, `allowWheelScrub` and `onValueCommitted`, and `id` and `form`, go to Base
 * UI's `NumberField.Root`, which gives the `id` to the input.
 *
 * @summary A number input with a label, stepper buttons, an optional description and an error message.
 * @experimental
 */
export function NumberField({
    label,
    description,
    error,
    value,
    defaultValue,
    onValueChange,
    onValueCommitted,
    min,
    max,
    step,
    largeStep,
    smallStep,
    snapOnStep,
    allowOutOfRange,
    allowWheelScrub,
    format,
    locale,
    id,
    form,
    decrementLabel,
    incrementLabel,
    required,
    disabled,
    readOnly,
    name,
    className,
    style,
    slotProps,
    ...inputProps
}: NumberFieldProps) {
    const ownerState: NumberFieldOwnerState = { disabled: Boolean(disabled), required: Boolean(required), readonly: Boolean(readOnly) };
    const {
        group: groupSlotProps,
        input: inputSlotProps,
        decrement: decrementSlotProps,
        increment: incrementSlotProps,
        ...formFieldSlotProps
    } = slotProps ?? {};

    return (
        <FormField
            label={label}
            description={description}
            error={error}
            required={required}
            disabled={disabled}
            name={name}
            data-readonly={ownerState.readonly ? "" : undefined}
            className={clsx(styles.root, className)}
            style={style}
            slotProps={resolveFormFieldSlotProps(formFieldSlotProps, ownerState)}
        >
            <BaseNumberField.Root
                id={id}
                form={form}
                value={value}
                defaultValue={defaultValue ?? undefined}
                onValueChange={onValueChange}
                onValueCommitted={onValueCommitted}
                min={min}
                max={max}
                step={step}
                largeStep={largeStep}
                smallStep={smallStep}
                snapOnStep={snapOnStep}
                allowOutOfRange={allowOutOfRange}
                allowWheelScrub={allowWheelScrub}
                format={format}
                locale={locale}
                required={required}
                disabled={disabled}
                readOnly={readOnly}
            >
                <BaseNumberField.Group {...resolveSlotProps({ ownProps: { className: styles.group }, slotProps: groupSlotProps, ownerState })}>
                    <BaseNumberField.Input
                        {...resolveSlotProps({
                            // Base UI's default role description is English text.
                            ownProps: { "aria-roledescription": undefined, ...inputProps, className: styles.input },
                            slotProps: inputSlotProps,
                            ownerState,
                        })}
                    />
                    <BaseNumberField.Decrement
                        {...resolveSlotProps({
                            ownProps: { className: styles.decrement, children: <Icon name="minus" />, ...stepButtonNameProps(decrementLabel) },
                            slotProps: decrementSlotProps,
                            ownerState,
                        })}
                    />
                    <BaseNumberField.Increment
                        {...resolveSlotProps({
                            ownProps: { className: styles.increment, children: <Icon name="plus" />, ...stepButtonNameProps(incrementLabel) },
                            slotProps: incrementSlotProps,
                            ownerState,
                        })}
                    />
                </BaseNumberField.Group>
            </BaseNumberField.Root>
        </FormField>
    );
}

type FormFieldPartSlotProps = Pick<NumberFieldSlotProps, "label" | "requiredIndicator" | "description" | "error">;

/** Resolves the slot props of FormField's parts with the number field's owner state, which FormField doesn't know. */
function resolveFormFieldSlotProps(slotProps: FormFieldPartSlotProps, ownerState: NumberFieldOwnerState): FormFieldSlotProps {
    const resolve = <PartProps,>(partSlotProps: SlotProps<PartProps, NumberFieldOwnerState> | undefined) =>
        typeof partSlotProps === "function" ? partSlotProps(ownerState) : partSlotProps;

    return {
        label: resolve(slotProps.label),
        requiredIndicator: resolve(slotProps.requiredIndicator),
        description: resolve(slotProps.description),
        error: resolve(slotProps.error),
    };
}

/** Replaces Base UI's English default name of a step button, or hides the button from assistive technology without a name. */
function stepButtonNameProps(label: string | undefined) {
    return label ? { "aria-label": label } : { "aria-label": undefined, "aria-hidden": true };
}
