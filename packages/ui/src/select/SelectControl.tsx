"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import { clsx } from "clsx";
import { type CSSProperties, type ReactNode, useRef, useState } from "react";

import { Icon } from "../icon/Icon";
import { hasContent } from "../slots/hasContent";
import { type ElementSlotProps, SlotElement } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import { usePopupTheme } from "../themeSwitch/usePopupTheme";
import type { SelectOption } from "./Select";
// SelectControl is a Select without its field, so its parts keep the classes of Select's styling contract.
// eslint-disable-next-line @dextinity/no-private-sibling-import
import styles from "./Select.module.css";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type SelectControlOwnerState = {
    disabled: boolean;
    required: boolean;
    readonly: boolean;
};

/** @experimental */
export interface SelectControlSlotProps {
    /** The button that shows the selected option and opens the list. It has the `combobox` role and receives the props the component doesn't handle. */
    trigger?: SlotProps<BaseSelect.Trigger.Props, SelectControlOwnerState>;
    /** The text in the trigger: the selected options' labels, or `placeholder` while nothing is selected. */
    value?: SlotProps<BaseSelect.Value.Props, SelectControlOwnerState>;
    /** The element around the chevron at the end of the trigger. */
    icon?: SlotProps<BaseSelect.Icon.Props, SelectControlOwnerState>;
    /** The element around `endAdornment`, placed over the end of the trigger, before the chevron. Rendered only while there is an end adornment. */
    endAdornment?: SlotProps<ElementSlotProps<"span">, SelectControlOwnerState>;
    /** The element that positions the list against the trigger. Its props, such as `side`, `align` and `sideOffset`, change where the list opens. */
    positioner?: SlotProps<BaseSelect.Positioner.Props, SelectControlOwnerState>;
    /** The surface of the list, which floats above the page. */
    popup?: SlotProps<BaseSelect.Popup.Props, SelectControlOwnerState>;
    /** The element that holds `message`, above the options. Rendered only while there is a message. */
    message?: SlotProps<ElementSlotProps<"div">, SelectControlOwnerState>;
    /** The element around the options, which has the `listbox` role and scrolls when the options don't fit. */
    list?: SlotProps<BaseSelect.List.Props, SelectControlOwnerState>;
    /** Each option, which has the `option` role. */
    option?: SlotProps<Omit<BaseSelect.Item.Props, "value">, SelectControlOwnerState>;
    /** The element around each option's label. */
    optionText?: SlotProps<BaseSelect.ItemText.Props, SelectControlOwnerState>;
    /** The check mark after a selected option's label. Rendered only for the selected options. */
    optionIndicator?: SlotProps<BaseSelect.ItemIndicator.Props, SelectControlOwnerState>;
}

type SelectRootProps = BaseSelect.Root.Props<string>;

/** @experimental */
export interface SelectControlProps
    extends
        Omit<
            BaseSelect.Trigger.Props,
            "className" | "style" | "render" | "nativeButton" | "children" | "disabled" | "value" | "defaultValue" | "name" | "form" | "autoComplete"
        >,
        Pick<SelectRootProps, "open" | "defaultOpen" | "onOpenChange" | "readOnly" | "inputRef" | "form" | "autoComplete"> {
    /**
     * The options to choose from, in the order they're listed.
     *
     * @defaultValue `[]`
     */
    options?: readonly SelectOption[];
    /** Lets the user select several options. The value is then an array of the selected options' values. */
    multiple?: boolean;
    /** Shown in the trigger while no option is selected. */
    placeholder?: ReactNode;
    /** The selected value: an option's value or `null`, or an array of values for a `multiple` select. Use it with `onValueChange` to control the select. */
    value?: string | readonly string[] | null;
    /** The value that is selected initially, for a select that keeps its value itself. */
    defaultValue?: string | readonly string[] | null;
    /** Called with the new value when the user selects or deselects an option. */
    onValueChange?: (value: string | string[] | null, eventDetails: BaseSelect.Root.ChangeEventDetails) => void;
    /** Content over the end of the trigger, before the chevron, such as an `IconButton` that clears the value. It isn't part of the trigger's button. */
    endAdornment?: ReactNode;
    /** A message in the list above the options, for example while the options load or when there are none. */
    message?: ReactNode;
    /** Requires a selected option. */
    required?: boolean;
    /** Prevents interaction and dims the trigger. */
    disabled?: boolean;
    /** Identifies the value when a form is submitted. */
    name?: string;
    /** Added to the component's own classes on the outer element, which holds the trigger and the end adornment. */
    className?: string;
    /** Inline styles for the outer element, which holds the trigger and the end adornment. */
    style?: CSSProperties;
    /**
     * Props for the inner parts: `trigger`, `value`, `icon`, `endAdornment`, `positioner`, `popup`, `message`,
     * `list`, `option`, `optionText` and `optionIndicator`. As a function, it receives the owner state:
     * `disabled`, `required` and `readonly`.
     */
    slotProps?: SelectControlSlotProps;
}

/**
 * The control of a `Select` without its label, description and error: the trigger that shows the selected
 * options and the list that opens from it.
 *
 * Use it as the control of a `FormField`, which names it with its label and connects the description and the
 * error, for example where a form library renders the field around it. For a select with a label, use
 * `Select`. On its own, name the trigger with `aria-label`.
 *
 * Set `multiple` to let the user select several options; the list then stays open while they choose. Use
 * `message` to say that the options load or that there are none, and `endAdornment` for an action on the
 * value, such as clearing it.
 *
 * The props the component doesn't handle, such as `id`, `onBlur`, `aria-*` and `ref`, go to the trigger.
 *
 * @summary The trigger and the list of a select, without a label.
 * @experimental
 */
export function SelectControl({
    options = [],
    multiple,
    placeholder,
    value,
    defaultValue,
    onValueChange,
    endAdornment,
    message,
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
}: SelectControlProps) {
    const ownerState: SelectControlOwnerState = { disabled: Boolean(disabled), required: Boolean(required), readonly: Boolean(readOnly) };
    // The trigger's `ref` belongs to the consumer; the control around it is in the same theme.
    const controlRef = useRef<HTMLSpanElement>(null);
    const [isOpen, setIsOpen] = useState(Boolean(defaultOpen));
    const popupTheme = usePopupTheme(controlRef, open ?? isOpen);

    return (
        <BaseSelect.Root<string, boolean>
            items={options}
            multiple={multiple}
            value={value as string | string[] | null | undefined}
            defaultValue={defaultValue as string | string[] | null | undefined}
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
            disabled={disabled}
            name={name}
            inputRef={inputRef}
            form={form}
            autoComplete={autoComplete}
        >
            <span
                ref={controlRef}
                className={clsx(styles.control, className)}
                style={style}
                data-disabled={ownerState.disabled ? "" : undefined}
                data-readonly={ownerState.readonly ? "" : undefined}
            >
                <BaseSelect.Trigger
                    {...resolveSlotProps({ ownProps: { ...triggerProps, className: styles.trigger }, slotProps: slotProps?.trigger, ownerState })}
                >
                    <BaseSelect.Value
                        {...resolveSlotProps({ ownProps: { className: styles.value, placeholder }, slotProps: slotProps?.value, ownerState })}
                    />
                    <BaseSelect.Icon {...resolveSlotProps({ ownProps: { className: styles.icon }, slotProps: slotProps?.icon, ownerState })}>
                        <Icon name="chevron-down" />
                    </BaseSelect.Icon>
                </BaseSelect.Trigger>
                {hasContent(endAdornment) && (
                    <SlotElement
                        tagName="span"
                        {...resolveSlotProps({ ownProps: { className: styles.endAdornment }, slotProps: slotProps?.endAdornment, ownerState })}
                    >
                        {endAdornment}
                    </SlotElement>
                )}
            </span>
            <BaseSelect.Portal>
                <BaseSelect.Positioner
                    {...resolveSlotProps({
                        // Aligning the selected option with the trigger covers the field and its label, and
                        // falls back to this placement on touch and near the viewport's edges anyway.
                        ownProps: { ...popupTheme, className: styles.positioner, alignItemWithTrigger: false, align: "start", sideOffset: 4 },
                        slotProps: slotProps?.positioner,
                        ownerState,
                    })}
                >
                    <BaseSelect.Popup {...resolveSlotProps({ ownProps: { className: styles.popup }, slotProps: slotProps?.popup, ownerState })}>
                        {hasContent(message) && (
                            <SlotElement
                                tagName="div"
                                {...resolveSlotProps({ ownProps: { className: styles.message }, slotProps: slotProps?.message, ownerState })}
                            >
                                {message}
                            </SlotElement>
                        )}
                        <BaseSelect.List {...resolveSlotProps({ ownProps: { className: styles.list }, slotProps: slotProps?.list, ownerState })}>
                            {options.map((option) => (
                                <BaseSelect.Item
                                    key={option.value}
                                    {...resolveSlotProps({
                                        ownProps: { className: styles.option, disabled: option.disabled },
                                        slotProps: slotProps?.option,
                                        ownerState,
                                    })}
                                    value={option.value}
                                >
                                    <BaseSelect.ItemText
                                        {...resolveSlotProps({
                                            ownProps: { className: styles.optionText },
                                            slotProps: slotProps?.optionText,
                                            ownerState,
                                        })}
                                    >
                                        {option.label}
                                    </BaseSelect.ItemText>
                                    <BaseSelect.ItemIndicator
                                        {...resolveSlotProps({
                                            ownProps: { className: styles.optionIndicator },
                                            slotProps: slotProps?.optionIndicator,
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
    );
}
