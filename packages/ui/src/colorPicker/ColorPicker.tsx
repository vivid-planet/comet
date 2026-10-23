"use client";

import type { Field } from "@base-ui/react/field";
import { Input } from "@base-ui/react/input";
import { clsx } from "clsx";
import { type CSSProperties, type ReactNode, useCallback, useId, useRef, useState } from "react";

import { FormField, type FormFieldSlotProps } from "../formField/FormField";
import { Icon } from "../icon/Icon";
import { type ElementSlotProps, SlotElement } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import styles from "./ColorPicker.module.css";

/**
 * A color the user can pick with one click, below the input.
 *
 * @experimental
 */
export interface ColorPickerPreset {
    /** The color as a hex value with three or six digits, for example `"#403af2"`. A preset with another value is left out. */
    value: string;
    /** The color's name, for example "Brand blue". It names the preset's button for assistive technology. */
    label: string;
}

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type ColorPickerOwnerState = {
    disabled: boolean;
    required: boolean;
    readonly: boolean;
};

/** @experimental */
export interface ColorPickerSlotProps {
    /** The box with the border around the swatch, the hex input and the clear button. */
    group?: SlotProps<ElementSlotProps<"div">, ColorPickerOwnerState>;
    /** The square at the input's start that shows the current color. It has `data-empty` and shows a diagonal line while there is no color. */
    swatch?: SlotProps<ElementSlotProps<"span">, ColorPickerOwnerState>;
    /** The invisible `<input type="color">` that covers the swatch and opens the browser's color picker. It isn't rendered in a read-only field. */
    picker?: SlotProps<ElementSlotProps<"input">, ColorPickerOwnerState>;
    /** The `<input>` for the hex value, which receives focus and the props the component doesn't handle. */
    input?: SlotProps<Input.Props, ColorPickerOwnerState>;
    /**
     * The button that clears the value. It is only shown with `clearLabel`, while the input isn't empty and the field is neither
     * `required`, `readOnly` nor disabled, also by an enclosing Base UI `Fieldset`. Its `children`, the `close` icon, can be replaced.
     */
    clear?: SlotProps<ElementSlotProps<"button">, ColorPickerOwnerState>;
    /** The element around the preset buttons. It has the `group` role and is named by the label. It is only rendered with `presets`, in a field that isn't read-only. */
    presets?: SlotProps<ElementSlotProps<"div">, ColorPickerOwnerState>;
    /** The button of each preset. It has `aria-pressed="true"` and `data-pressed` while its color is the value. */
    preset?: SlotProps<ElementSlotProps<"button">, ColorPickerOwnerState>;
    /** The `<label>` element, which holds `label` and the required indicator. */
    label?: SlotProps<Field.Label.Props, ColorPickerOwnerState>;
    /** The asterisk after the label of a required field. Assistive technology skips it and learns from the input that it is required. */
    requiredIndicator?: SlotProps<ElementSlotProps<"span">, ColorPickerOwnerState>;
    /** The paragraph that holds `description`. */
    description?: SlotProps<Field.Description.Props, ColorPickerOwnerState>;
    /** The element that holds the error message. It is only rendered while there is an error to show. */
    error?: SlotProps<Field.Error.Props, ColorPickerOwnerState>;
}

/** @experimental */
export interface ColorPickerProps extends Omit<
    Input.Props,
    | "className"
    | "style"
    | "render"
    | "children"
    | "type"
    | "value"
    | "defaultValue"
    | "onValueChange"
    | "pattern"
    | "disabled"
    | "required"
    | "readOnly"
    | "name"
> {
    /** The visible label that names the hex input. Keep it short and specific, for example "Background color". */
    label: ReactNode;
    /** Help text below the field, for example where the color is used. Screen readers announce it together with the label. */
    description?: ReactNode;
    /**
     * An error message, for example from a form library or the server. It marks the field invalid and is
     * shown below the field. Say how to fix the value, for example "Enter a hex color like #403af2". Without
     * it, the field shows the browser's message for a failed check, such as `required` or text that isn't a
     * hex color, once Base UI validates the input: when the user presses Enter in it, or on submit in a Base
     * UI `Form`.
     */
    error?: ReactNode;
    /** The color as a hex value, when your application controls it. `null` empties the field. Update it in `onValueChange`. */
    value?: string | null;
    /** The initial color of a field that keeps its value itself, as a hex value. Leave it out, or pass `null`, for an empty field. */
    defaultValue?: string | null;
    /**
     * Called with the new color as a lowercase `#rrggbb`, or with `null` once the field is emptied. It runs
     * when the typed text is committed, on blur or Enter, when the user selects a preset or clears the field,
     * and repeatedly while the user moves through the browser's color picker.
     */
    onValueChange?: (value: string | null) => void;
    /**
     * Colors the user can pick with one click, such as the brand's colors, as buttons below the input. Give
     * each a `label`, which names its button for assistive technology; the field's label names the group of
     * buttons. Keep the list short: each button is a Tab stop, and the buttons wrap onto further lines when
     * space runs out. Pressing the button of the current color keeps it.
     */
    presets?: ColorPickerPreset[];
    /**
     * The accessible name of the swatch, which opens the browser's color picker, for example "Pick background
     * color". Without it, the swatch is only for pointer users: Tab and assistive technology skip it, and
     * keyboard and screen reader users type the hex value. With it, keyboard users can open the color picker
     * too.
     */
    pickerLabel?: string;
    /**
     * The accessible name of a button at the input's end that clears the field, for example "Clear background
     * color". Without it, there is no such button: users clear the field by deleting the text. The button
     * isn't shown while the input is empty or the field is `required`, `readOnly` or disabled, also by an
     * enclosing Base UI `Fieldset`.
     */
    clearLabel?: string;
    /** Requires a color and shows an asterisk after the label. */
    required?: boolean;
    /** Prevents interaction and dims the label, the input and the presets. The description stays readable, so it can explain why. */
    disabled?: boolean;
    /**
     * Shows the color without letting the user change it: the swatch doesn't open the color picker, and the
     * presets and the clear button aren't shown. The input still receives focus, so the value can be selected
     * and copied.
     */
    readOnly?: boolean;
    /** Identifies the value when a form is submitted. The form receives the hex value, or an empty string. */
    name?: string;
    /** Added to the component's own classes on the outer element, which holds all parts. */
    className?: string;
    /** Inline styles for the outer element, which holds all parts. */
    style?: CSSProperties;
    /**
     * Props for the inner parts: `group` (the box with the border), `swatch`, `picker` (the color input on
     * the swatch), `input`, `clear`, `presets` (the element around the preset buttons), `preset`, `label`,
     * `requiredIndicator`, `description` and `error`. As a function, it receives the owner state: `disabled`,
     * `required` and `readonly`.
     */
    slotProps?: ColorPickerSlotProps;
}

/** Text typed into the hex input that isn't committed yet, and the value it was typed over. */
type Draft = { text: string; value: string | null };

/** Three or six hex digits, with or without `#`, for the browser's check of the hex input. */
const hexColorPattern = "#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})";

/** The color as a lowercase `#rrggbb`, or `null` if the text isn't a hex color with three or six digits. */
function normalizeHexColor(text: string) {
    const digits = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(text.trim())?.[1].toLowerCase();
    if (digits === undefined) {
        return null;
    }
    return `#${digits.length === 3 ? [...digits].map((digit) => digit + digit).join("") : digits}`;
}

/**
 * A form field for a color, entered as a hex value, such as a brand color or the background of a section.
 *
 * The user types the hex value, picks the color in the browser's color picker, which the swatch at the
 * input's start opens, or selects one of the `presets` below the input. Offer presets for the colors that
 * fit the design, so users don't need to know hex values. Set `clearLabel` for an optional field, so it can
 * be emptied with one click.
 *
 * The input accepts three or six hex digits, with or without `#`, and turns them into a lowercase `#rrggbb`
 * when it loses focus or the user presses Enter. Text that isn't a hex color stays in the input, so the user
 * can correct it, and doesn't change the value. The field shows it as invalid once Base UI validates the
 * input, when the user presses Enter in it or on submit in a Base UI `Form`, and while you pass `error`.
 *
 * The hex input is the labelled control that keyboard and screen reader users work with: the swatch is for
 * pointer users, unless you name it with `pickerLabel`. In an empty field, the browser's color picker starts
 * at black, and picking black there leaves the field empty: type `#000` instead. The props the component
 * doesn't handle, such as `placeholder`, `autoFocus` and `ref`, go to the hex input.
 *
 * @summary A hex color input with a swatch that opens the browser's color picker, and optional presets.
 * @experimental
 */
export function ColorPicker({
    label,
    description,
    error,
    value: valueProp,
    defaultValue = null,
    onValueChange,
    presets,
    pickerLabel,
    clearLabel,
    required,
    disabled,
    readOnly,
    name,
    className,
    style,
    slotProps,
    ref,
    onBlur,
    onKeyDown,
    ...inputProps
}: ColorPickerProps) {
    const ownerState: ColorPickerOwnerState = { disabled: Boolean(disabled), required: Boolean(required), readonly: Boolean(readOnly) };
    const {
        group: groupSlotProps,
        swatch: swatchSlotProps,
        picker: pickerSlotProps,
        input: inputSlotProps,
        clear: clearSlotProps,
        presets: presetsSlotProps,
        preset: presetSlotProps,
        ...formFieldSlotProps
    } = slotProps ?? {};

    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const value = valueProp === undefined ? uncontrolledValue : valueProp;
    const color = value === null ? null : normalizeHexColor(value);
    const [draft, setDraft] = useState<Draft | null>(null);
    // A draft typed over an earlier value is discarded when the value changes, for example when a form resets it.
    const activeDraft = draft !== null && draft.value === value ? draft : null;
    const text = activeDraft?.text ?? value ?? "";
    const isClearable = Boolean(clearLabel) && text !== "" && !required && !disabled && !readOnly;
    const shownPresets = readOnly
        ? []
        : (presets ?? []).flatMap((preset) => {
              const presetColor = normalizeHexColor(preset.value);
              return presetColor === null ? [] : [{ ...preset, color: presetColor }];
          });

    const formFieldPartSlotProps = resolveFormFieldSlotProps(formFieldSlotProps, ownerState);
    const generatedLabelId = useId();
    const labelId = formFieldPartSlotProps.label?.id ?? generatedLabelId;

    const inputRef = useRef<HTMLInputElement | null>(null);
    const setInputRef = useCallback(
        (node: HTMLInputElement | null) => {
            inputRef.current = node;
            if (typeof ref === "function") {
                ref(node);
            } else if (ref) {
                ref.current = node;
            }
        },
        [ref],
    );

    function changeValue(nextValue: string | null) {
        setDraft(null);
        if (nextValue === value) {
            return;
        }
        if (valueProp === undefined) {
            setUncontrolledValue(nextValue);
        }
        onValueChange?.(nextValue);
    }

    function commitText() {
        if (activeDraft === null) {
            return;
        }
        if (activeDraft.text.trim() === "") {
            changeValue(null);
            return;
        }
        const nextValue = normalizeHexColor(activeDraft.text);
        if (nextValue !== null) {
            changeValue(nextValue);
        }
    }

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
            slotProps={{ ...formFieldPartSlotProps, label: { ...formFieldPartSlotProps.label, id: labelId } }}
        >
            <SlotElement tagName="div" {...resolveSlotProps({ ownProps: { className: styles.group }, slotProps: groupSlotProps, ownerState })}>
                <SlotElement
                    tagName="span"
                    {...resolveSlotProps({
                        ownProps: { className: styles.swatch, style: color === null ? undefined : { backgroundColor: color } },
                        slotProps: swatchSlotProps,
                        ownerState,
                    })}
                    data-empty={color === null ? "" : undefined}
                >
                    {!readOnly && (
                        <SlotElement
                            tagName="input"
                            {...resolveSlotProps({
                                ownProps: {
                                    type: "color",
                                    // The swatch shows a missing color; the picker needs a color to start from.
                                    value: color ?? "#000000",
                                    disabled,
                                    onChange: (event) => changeValue(event.currentTarget.value),
                                    className: styles.picker,
                                    ...(pickerLabel ? { "aria-label": pickerLabel } : { "aria-hidden": true, tabIndex: -1 }),
                                },
                                slotProps: pickerSlotProps,
                                ownerState,
                            })}
                        />
                    )}
                </SlotElement>
                <Input
                    {...resolveSlotProps({
                        ownProps: {
                            autoComplete: "off",
                            autoCapitalize: "off",
                            autoCorrect: "off",
                            spellCheck: false,
                            ...inputProps,
                            ref: setInputRef,
                            value: text,
                            onValueChange: (nextText: string) => setDraft({ text: nextText, value }),
                            onBlur: (event) => {
                                onBlur?.(event);
                                commitText();
                            },
                            onKeyDown: (event) => {
                                onKeyDown?.(event);
                                if (event.key === "Enter") {
                                    commitText();
                                }
                            },
                            pattern: hexColorPattern,
                            required,
                            readOnly,
                            className: styles.input,
                        },
                        slotProps: inputSlotProps,
                        ownerState,
                    })}
                />
                {isClearable && (
                    <SlotElement
                        tagName="button"
                        {...resolveSlotProps({
                            ownProps: {
                                type: "button",
                                "aria-label": clearLabel,
                                onClick: () => {
                                    changeValue(null);
                                    inputRef.current?.focus();
                                },
                                className: styles.clear,
                                children: <Icon name="close" />,
                            },
                            slotProps: clearSlotProps,
                            ownerState,
                        })}
                    />
                )}
            </SlotElement>
            {shownPresets.length > 0 && (
                <SlotElement
                    tagName="div"
                    {...resolveSlotProps({
                        ownProps: { role: "group", "aria-labelledby": labelId, className: styles.presets },
                        slotProps: presetsSlotProps,
                        ownerState,
                    })}
                >
                    {shownPresets.map((preset) => {
                        const isSelected = preset.color === color;

                        return (
                            <SlotElement
                                key={preset.value}
                                tagName="button"
                                {...resolveSlotProps({
                                    ownProps: {
                                        type: "button",
                                        "aria-label": preset.label,
                                        "aria-pressed": isSelected,
                                        disabled,
                                        onClick: () => changeValue(preset.color),
                                        className: styles.preset,
                                        style: { backgroundColor: preset.color },
                                    },
                                    slotProps: presetSlotProps,
                                    ownerState,
                                })}
                                data-pressed={isSelected ? "" : undefined}
                            />
                        );
                    })}
                </SlotElement>
            )}
        </FormField>
    );
}

type FormFieldPartSlotProps = Pick<ColorPickerSlotProps, "label" | "requiredIndicator" | "description" | "error">;

/** Resolves the slot props of FormField's parts with the color picker's owner state, which FormField doesn't know. */
function resolveFormFieldSlotProps(slotProps: FormFieldPartSlotProps, ownerState: ColorPickerOwnerState) {
    const resolve = <PartProps,>(partSlotProps: SlotProps<PartProps, ColorPickerOwnerState> | undefined) =>
        typeof partSlotProps === "function" ? partSlotProps(ownerState) : partSlotProps;

    return {
        label: resolve(slotProps.label),
        requiredIndicator: resolve(slotProps.requiredIndicator),
        description: resolve(slotProps.description),
        error: resolve(slotProps.error),
    } satisfies FormFieldSlotProps;
}
