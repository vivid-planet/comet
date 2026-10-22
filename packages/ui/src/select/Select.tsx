"use client";

import type { Field } from "@base-ui/react/field";
import { Select as BaseSelect } from "@base-ui/react/select";
import { clsx } from "clsx";
import { type CSSProperties, type ReactNode, useRef, useState } from "react";

import { FormField } from "../formField/FormField";
import { Icon } from "../icon/Icon";
import type { ElementSlotProps } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import { usePopupTheme } from "../themeSwitch/usePopupTheme";
import styles from "./Select.module.css";

/**
 * One option of a `Select`.
 *
 * @experimental
 */
export interface SelectOption {
    /** The value the select takes while this option is selected, and submits with a form. Unique within the options. */
    value: string;
    /** The option's visible text, in the list and in the field while the option is selected. */
    label: string;
    /** Prevents selecting the option and dims it. Prefer leaving out an option that never applies. */
    disabled?: boolean;
}

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type SelectOwnerState = {
    disabled: boolean;
    required: boolean;
    readonly: boolean;
};

/** @experimental */
export interface SelectSlotProps {
    /** The button that shows the selected option and opens the list. It has the `combobox` role and receives the props the component doesn't handle. */
    trigger?: SlotProps<BaseSelect.Trigger.Props, SelectOwnerState>;
    /** The text in the trigger: the selected option's label, or `placeholder` while nothing is selected. */
    value?: SlotProps<BaseSelect.Value.Props, SelectOwnerState>;
    /** The element around the chevron at the end of the trigger. */
    icon?: SlotProps<BaseSelect.Icon.Props, SelectOwnerState>;
    /** The element that positions the list against the trigger. Its props, such as `side`, `align` and `sideOffset`, change where the list opens. */
    positioner?: SlotProps<BaseSelect.Positioner.Props, SelectOwnerState>;
    /** The surface of the list, which floats above the page. */
    popup?: SlotProps<BaseSelect.Popup.Props, SelectOwnerState>;
    /** The element around the options, which has the `listbox` role and scrolls when the options don't fit. */
    list?: SlotProps<BaseSelect.List.Props, SelectOwnerState>;
    /** Each option, which has the `option` role. */
    option?: SlotProps<Omit<BaseSelect.Item.Props, "value">, SelectOwnerState>;
    /** The element around each option's label. */
    optionText?: SlotProps<BaseSelect.ItemText.Props, SelectOwnerState>;
    /** The check mark after the selected option's label. Rendered only for the selected option. */
    optionIndicator?: SlotProps<BaseSelect.ItemIndicator.Props, SelectOwnerState>;
    /** The element that holds `label` and the required indicator. Clicking it focuses the trigger without opening the list. */
    label?: SlotProps<Field.Label.Props, SelectOwnerState>;
    /** The asterisk after the label of a required field. Assistive technology skips it and learns from the trigger that it is required. */
    requiredIndicator?: SlotProps<ElementSlotProps<"span">, SelectOwnerState>;
    /** The paragraph that holds `description`. */
    description?: SlotProps<Field.Description.Props, SelectOwnerState>;
    /** The element that holds the error message. It is only rendered while there is an error to show. */
    error?: SlotProps<Field.Error.Props, SelectOwnerState>;
}

type SelectRootProps = BaseSelect.Root.Props<string>;

/** @experimental */
export interface SelectProps
    extends
        Omit<
            BaseSelect.Trigger.Props,
            "className" | "style" | "render" | "nativeButton" | "children" | "disabled" | "value" | "name" | "form" | "autoComplete"
        >,
        Pick<SelectRootProps, "open" | "defaultOpen" | "onOpenChange" | "readOnly" | "inputRef" | "form" | "autoComplete"> {
    /** The visible label that names the select. Keep it short and specific, for example "Country". */
    label: ReactNode;
    /**
     * Help text below the select, for example what the choice affects. Screen readers announce it together
     * with the label.
     */
    description?: ReactNode;
    /**
     * An error message, for example from a form library or the server. It marks the field invalid and is
     * shown below the select. Say how to fix the value, for example "Choose a country". Without it, the field
     * shows the browser's message for a failed constraint, such as `required`, once Base UI validates the
     * select, for example on submit in a Base UI `Form`.
     */
    error?: ReactNode;
    /**
     * The options to choose from, in the order they're listed. Each option has a `value`, which the select
     * takes and submits, a `label`, which it shows, and optionally `disabled`. Keep the list short, up to about
     * 15 options, and order it logically; for a longer list, use `Autocomplete`, which filters the options as
     * the user types.
     *
     * @defaultValue `[]`
     */
    options?: readonly SelectOption[];
    /**
     * Shown in the trigger while no option is selected, for example "Choose a country". It isn't an option:
     * once the user selected one, they can't go back to no value. Add an option for that, such as "None",
     * where no value is a valid choice.
     */
    placeholder?: ReactNode;
    /** The value of the selected option, or `null` for none. Use it with `onValueChange` to control the select. */
    value?: string | null;
    /** The value of the option that is selected initially, for a select that keeps its value itself. */
    defaultValue?: string | null;
    /** Called with the new value when the user selects an option. */
    onValueChange?: (value: string | null, eventDetails: BaseSelect.Root.ChangeEventDetails) => void;
    /** Requires a selected option and shows an asterisk after the label. */
    required?: boolean;
    /** Prevents interaction and dims the label and the trigger. The description stays readable, so it can explain why. */
    disabled?: boolean;
    /** Identifies the value when a form is submitted. */
    name?: string;
    /** Added to the component's own classes on the outer element, which holds all parts. */
    className?: string;
    /** Inline styles for the outer element, which holds all parts. */
    style?: CSSProperties;
    /**
     * Props for the inner parts: `trigger`, `value`, `icon`, `positioner`, `popup`, `list`, `option`,
     * `optionText`, `optionIndicator`, `label`, `requiredIndicator`, `description` and `error`. As a function,
     * it receives the owner state: `disabled`, `required` and `readonly`.
     */
    slotProps?: SelectSlotProps;
}

/**
 * A form field to choose one option from a short list, such as a country or a sort order. The trigger shows
 * the selected option; clicking it, or pressing Enter, Space or an arrow key while it has focus, opens the
 * list. Typing the first letters of an option highlights it in the open list, and selects it while the list
 * is closed.
 *
 * Label every select with `label`, and use `placeholder` to prompt for a choice while nothing is selected. For
 * a few options that the user should compare, use `RadioGroup`, which shows them all at once. For a long list,
 * use `Autocomplete`, which filters the options as the user types.
 *
 * The list opens below the trigger, or above it where there's no room below, and is at least as wide as the
 * trigger. A wider list grows towards the trigger's end, and moves back only where it doesn't fit. It takes
 * the theme of a `ThemeSwitch` around the select, like the trigger. Screen readers announce the description
 * and the error message when the trigger receives focus. After a failed submit, move focus to the first
 * invalid field, for example through `ref`, so its error is announced.
 *
 * The props the component doesn't handle, such as `id`, `onBlur`, `aria-*` and `ref`, go to the trigger.
 *
 * @summary A form field to choose one option from a short list.
 * @experimental
 */
export function Select({
    label,
    description,
    error,
    options = [],
    placeholder,
    value,
    defaultValue,
    onValueChange,
    open,
    defaultOpen,
    onOpenChange,
    readOnly,
    inputRef,
    form,
    autoComplete,
    required,
    disabled,
    name,
    className,
    style,
    slotProps,
    ...triggerProps
}: SelectProps) {
    const ownerState: SelectOwnerState = { disabled: Boolean(disabled), required: Boolean(required), readonly: Boolean(readOnly) };
    const {
        trigger: triggerSlotProps,
        value: valueSlotProps,
        icon: iconSlotProps,
        positioner: positionerSlotProps,
        popup: popupSlotProps,
        list: listSlotProps,
        option: optionSlotProps,
        optionText: optionTextSlotProps,
        optionIndicator: optionIndicatorSlotProps,
        label: labelSlotProps,
        requiredIndicator: requiredIndicatorSlotProps,
        description: descriptionSlotProps,
        error: errorSlotProps,
    } = slotProps ?? {};
    // The trigger's `ref` belongs to the consumer; the root around it is in the same theme.
    const rootRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(Boolean(defaultOpen));
    const popupTheme = usePopupTheme(rootRef, open ?? isOpen);

    return (
        <FormField
            ref={rootRef}
            label={label}
            description={description}
            error={error}
            required={required}
            disabled={disabled}
            name={name}
            className={clsx(styles.root, className)}
            style={style}
            slotProps={{
                // Like Base UI's `Select.Label`: a `<label>` would open the list when clicked, instead of focusing the trigger.
                label: { nativeLabel: false, render: <div />, ...resolveFormFieldSlotProps(labelSlotProps, ownerState) },
                requiredIndicator: resolveFormFieldSlotProps(requiredIndicatorSlotProps, ownerState),
                description: resolveFormFieldSlotProps(descriptionSlotProps, ownerState),
                error: resolveFormFieldSlotProps(errorSlotProps, ownerState),
            }}
        >
            <BaseSelect.Root<string>
                items={options}
                value={value}
                defaultValue={defaultValue}
                onValueChange={onValueChange}
                open={open}
                defaultOpen={defaultOpen}
                onOpenChange={(nextOpen, eventDetails) => {
                    onOpenChange?.(nextOpen, eventDetails);
                    if (!eventDetails.isCanceled) {
                        setIsOpen(nextOpen);
                    }
                }}
                readOnly={readOnly}
                required={required}
                inputRef={inputRef}
                form={form}
                autoComplete={autoComplete}
            >
                <BaseSelect.Trigger
                    {...resolveSlotProps({ ownProps: { ...triggerProps, className: styles.trigger }, slotProps: triggerSlotProps, ownerState })}
                >
                    <BaseSelect.Value
                        {...resolveSlotProps({ ownProps: { className: styles.value, placeholder }, slotProps: valueSlotProps, ownerState })}
                    />
                    <BaseSelect.Icon {...resolveSlotProps({ ownProps: { className: styles.icon }, slotProps: iconSlotProps, ownerState })}>
                        <Icon name="chevron-down" />
                    </BaseSelect.Icon>
                </BaseSelect.Trigger>
                <BaseSelect.Portal>
                    <BaseSelect.Positioner
                        {...resolveSlotProps({
                            // Aligning the selected option with the trigger covers the field and its label, and
                            // falls back to this placement on touch and near the viewport's edges anyway.
                            ownProps: { ...popupTheme, className: styles.positioner, alignItemWithTrigger: false, align: "start", sideOffset: 4 },
                            slotProps: positionerSlotProps,
                            ownerState,
                        })}
                    >
                        <BaseSelect.Popup {...resolveSlotProps({ ownProps: { className: styles.popup }, slotProps: popupSlotProps, ownerState })}>
                            <BaseSelect.List {...resolveSlotProps({ ownProps: { className: styles.list }, slotProps: listSlotProps, ownerState })}>
                                {options.map((option) => (
                                    <BaseSelect.Item
                                        key={option.value}
                                        {...resolveSlotProps({
                                            ownProps: { className: styles.option, disabled: option.disabled },
                                            slotProps: optionSlotProps,
                                            ownerState,
                                        })}
                                        value={option.value}
                                    >
                                        <BaseSelect.ItemText
                                            {...resolveSlotProps({
                                                ownProps: { className: styles.optionText },
                                                slotProps: optionTextSlotProps,
                                                ownerState,
                                            })}
                                        >
                                            {option.label}
                                        </BaseSelect.ItemText>
                                        <BaseSelect.ItemIndicator
                                            {...resolveSlotProps({
                                                ownProps: { className: styles.optionIndicator },
                                                slotProps: optionIndicatorSlotProps,
                                                ownerState,
                                            })}
                                        >
                                            <Icon name="check" />
                                        </BaseSelect.ItemIndicator>
                                    </BaseSelect.Item>
                                ))}
                            </BaseSelect.List>
                        </BaseSelect.Popup>
                    </BaseSelect.Positioner>
                </BaseSelect.Portal>
            </BaseSelect.Root>
        </FormField>
    );
}

/** Resolves the slot props of FormField's parts with the select's owner state, which FormField doesn't know. */
function resolveFormFieldSlotProps<PartProps>(slotProps: SlotProps<PartProps, SelectOwnerState> | undefined, ownerState: SelectOwnerState) {
    return typeof slotProps === "function" ? slotProps(ownerState) : slotProps;
}
