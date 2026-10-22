"use client";

import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import type { Field } from "@base-ui/react/field";
import { clsx } from "clsx";
import { type CSSProperties, type ReactNode, useLayoutEffect, useMemo, useRef, useState } from "react";

import { FormField } from "../formField/FormField";
import { Icon } from "../icon/Icon";
import { hasContent } from "../slots/hasContent";
import { type ElementSlotProps, SlotElement } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import { usePopupTheme } from "../themeSwitch/usePopupTheme";
import styles from "./Autocomplete.module.css";

/**
 * One option of an `Autocomplete`.
 *
 * @experimental
 */
export interface AutocompleteOption {
    /** The value the autocomplete takes while this option is selected, and submits with a form. Unique within the options. */
    value: string;
    /** The option's visible text, in the list and in the input while the option is selected. Typing filters the options by it. */
    label: string;
    /** Prevents selecting the option and dims it. Prefer leaving out an option that never applies. */
    disabled?: boolean;
}

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type AutocompleteOwnerState = {
    disabled: boolean;
    required: boolean;
    readonly: boolean;
};

/** @experimental */
export interface AutocompleteSlotProps {
    /** The `<input>` element, which has the `combobox` role and receives the props the component doesn't handle. */
    input?: SlotProps<BaseCombobox.Input.Props, AutocompleteOwnerState>;
    /** The bordered box around the input and its buttons, which looks like a text field's input. */
    control?: SlotProps<BaseCombobox.InputGroup.Props, AutocompleteOwnerState>;
    /** The button that clears the value. Rendered only with `clearLabel`, while an option is selected. */
    clear?: SlotProps<BaseCombobox.Clear.Props, AutocompleteOwnerState>;
    /** The chevron button at the end of the box, which opens and closes the list. It is skipped by Tab: the input opens the list with the arrow keys. */
    trigger?: SlotProps<BaseCombobox.Trigger.Props, AutocompleteOwnerState>;
    /** The element that positions the list against the box. Its props, such as `side`, `align` and `sideOffset`, change where the list opens. */
    positioner?: SlotProps<BaseCombobox.Positioner.Props, AutocompleteOwnerState>;
    /** The surface of the list, which floats above the page. */
    popup?: SlotProps<BaseCombobox.Popup.Props, AutocompleteOwnerState>;
    /** The element around the options, which has the `listbox` role and scrolls when the options don't fit. */
    list?: SlotProps<BaseCombobox.List.Props, AutocompleteOwnerState>;
    /** Each option, which has the `option` role. */
    option?: SlotProps<Omit<BaseCombobox.Item.Props, "value">, AutocompleteOwnerState>;
    /** The element around each option's label. */
    optionText?: SlotProps<ElementSlotProps<"span">, AutocompleteOwnerState>;
    /** The check mark after the selected option's label. Rendered only for the selected option. */
    optionIndicator?: SlotProps<BaseCombobox.ItemIndicator.Props, AutocompleteOwnerState>;
    /** The element that holds `emptyMessage`. It stays in the page, so screen readers announce the message when no option matches. */
    empty?: SlotProps<BaseCombobox.Empty.Props, AutocompleteOwnerState>;
    /** The `<label>` element, which holds `label` and the required indicator. */
    label?: SlotProps<Field.Label.Props, AutocompleteOwnerState>;
    /** The asterisk after the label of a required field. Assistive technology skips it and learns from the input that it is required. */
    requiredIndicator?: SlotProps<ElementSlotProps<"span">, AutocompleteOwnerState>;
    /** The paragraph that holds `description`. */
    description?: SlotProps<Field.Description.Props, AutocompleteOwnerState>;
    /** The element that holds the error message. It is only rendered while there is an error to show. */
    error?: SlotProps<Field.Error.Props, AutocompleteOwnerState>;
}

type ComboboxRootProps = BaseCombobox.Root.Props<string>;

/** @experimental */
export interface AutocompleteProps
    extends
        Omit<
            BaseCombobox.Input.Props,
            | "className"
            | "style"
            | "render"
            | "children"
            | "disabled"
            | "required"
            | "readOnly"
            | "name"
            | "id"
            | "form"
            | "type"
            | "value"
            | "placeholder"
            | "autoComplete"
        >,
        Pick<
            ComboboxRootProps,
            | "open"
            | "defaultOpen"
            | "onOpenChange"
            | "inputValue"
            | "defaultInputValue"
            | "onInputValueChange"
            | "readOnly"
            | "inputRef"
            | "form"
            | "autoComplete"
        > {
    /** The visible label that names the input. Keep it short and specific, for example "Country". */
    label: ReactNode;
    /** The id of the `<input>`, which the label refers to. */
    id?: string;
    /**
     * Help text below the input, for example what the choice affects. Screen readers announce it together
     * with the label.
     */
    description?: ReactNode;
    /**
     * An error message, for example from a form library or the server. It marks the field invalid and is
     * shown below the input. Say how to fix the value, for example "Choose a country from the list". Without
     * it, the field shows the browser's message for a failed constraint, such as `required`, once Base UI
     * validates the input, for example on submit in a Base UI `Form`.
     */
    error?: ReactNode;
    /**
     * The options to choose from, in the order they're listed. Each option has a `value`, which the
     * autocomplete takes and submits, a `label`, which it shows and filters by, and optionally `disabled`.
     *
     * @defaultValue `[]`
     */
    options?: readonly AutocompleteOption[];
    /**
     * An example value, shown while the input is empty, for example "Start typing a country". It disappears
     * when the user types and doesn't replace the label.
     */
    placeholder?: string;
    /**
     * Shown in the list when no option matches what the user typed, for example "No country matches". Say
     * what the user can do, such as checking the spelling. Without it, the list is hidden while nothing matches,
     * and the input is marked collapsed.
     */
    emptyMessage?: ReactNode;
    /**
     * The accessible name of a button that clears the value, for example "Clear country". The button is shown
     * only with this label, while an option is selected. Without it, the user clears the value by deleting
     * the input's text.
     */
    clearLabel?: string;
    /** The value of the selected option, or `null` for none. Use it with `onValueChange` to control the autocomplete. */
    value?: string | null;
    /** The value of the option that is selected initially, for an autocomplete that keeps its value itself. */
    defaultValue?: string | null;
    /** Called with the new value when the user selects an option or clears the value. */
    onValueChange?: (value: string | null, eventDetails: BaseCombobox.Root.ChangeEventDetails) => void;
    /** Requires a selected option and shows an asterisk after the label. */
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
     * Props for the inner parts: `input`, `control`, `clear`, `trigger`, `positioner`, `popup`, `list`,
     * `option`, `optionText`, `optionIndicator`, `empty`, `label`, `requiredIndicator`, `description` and
     * `error`. As a function, it receives the owner state: `disabled`, `required` and `readonly`.
     */
    slotProps?: AutocompleteSlotProps;
}

/**
 * A form field to choose one option from a long list by typing to filter it, such as a country, a language
 * or a user. Typing shows the options whose label contains the text; the arrow keys move through them,
 * Enter selects one and Escape closes the list. The input then shows the selected option's label.
 *
 * Label every autocomplete with `label`, and set `emptyMessage` so the user learns when nothing matches. The
 * value is always one of the options, not free text. For a short list, up to about 15 options, use `Select`,
 * which lists all options without typing.
 *
 * The list opens below the input, or above it where there's no room below, and is as wide as the input. It
 * takes the theme of a `ThemeSwitch` around the autocomplete, like the input. Screen readers announce the
 * description and the error message when the input receives focus. After a failed submit, move focus to the
 * first invalid field, for example through `ref`, so its error is announced.
 *
 * The props the component doesn't handle, such as `onBlur`, `aria-*` and `ref`, go to the `<input>`.
 *
 * @summary A form field to choose one option from a long list by typing to filter it.
 * @experimental
 */
export function Autocomplete({
    label,
    description,
    error,
    options = [],
    placeholder,
    emptyMessage,
    clearLabel,
    value,
    defaultValue,
    onValueChange,
    id,
    open,
    defaultOpen,
    onOpenChange,
    inputValue,
    defaultInputValue,
    onInputValueChange,
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
    ...inputProps
}: AutocompleteProps) {
    const ownerState: AutocompleteOwnerState = { disabled: Boolean(disabled), required: Boolean(required), readonly: Boolean(readOnly) };
    const {
        input: inputSlotProps,
        control: controlSlotProps,
        clear: clearSlotProps,
        trigger: triggerSlotProps,
        positioner: positionerSlotProps,
        popup: popupSlotProps,
        list: listSlotProps,
        option: optionSlotProps,
        optionText: optionTextSlotProps,
        optionIndicator: optionIndicatorSlotProps,
        empty: emptySlotProps,
        label: labelSlotProps,
        requiredIndicator: requiredIndicatorSlotProps,
        description: descriptionSlotProps,
        error: errorSlotProps,
    } = slotProps ?? {};
    const items = useMemo(
        () => BaseCombobox.createItems(options, { getValue: (option) => option.value, getLabel: (option) => option.label }),
        [options],
    );
    // The input's `ref` belongs to the consumer; the root around it is in the same theme.
    const rootRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(Boolean(defaultOpen));
    const popupTheme = usePopupTheme(rootRef, open ?? isOpen);
    const [hasMatches, setHasMatches] = useState(true);
    // Base UI keeps the list open while no option matches. Without a message to show, the list is hidden and
    // marked collapsed rather than closed: closing it would replace the typed text with the selected label.
    const isListHidden = (open ?? isOpen) && !hasMatches && !hasContent(emptyMessage);
    const collapsedStateProps = isListHidden ? { "data-popup-open": undefined } : undefined;
    const collapsedAriaProps = isListHidden ? { ...collapsedStateProps, "aria-expanded": false, "aria-controls": undefined } : undefined;

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
                label: resolveFormFieldSlotProps(labelSlotProps, ownerState),
                requiredIndicator: resolveFormFieldSlotProps(requiredIndicatorSlotProps, ownerState),
                description: resolveFormFieldSlotProps(descriptionSlotProps, ownerState),
                error: resolveFormFieldSlotProps(errorSlotProps, ownerState),
            }}
        >
            <BaseCombobox.Root
                items={items}
                value={value}
                defaultValue={defaultValue}
                onValueChange={onValueChange}
                id={id}
                open={open}
                defaultOpen={defaultOpen}
                onOpenChange={(nextOpen, eventDetails) => {
                    onOpenChange?.(nextOpen, eventDetails);
                    if (!eventDetails.isCanceled) {
                        setIsOpen(nextOpen);
                    }
                }}
                inputValue={inputValue}
                defaultInputValue={defaultInputValue}
                onInputValueChange={onInputValueChange}
                readOnly={readOnly}
                required={required}
                inputRef={inputRef}
                form={form}
                autoComplete={autoComplete}
            >
                <FilterObserver onHasMatchesChange={setHasMatches} />
                <BaseCombobox.InputGroup
                    {...resolveSlotProps({
                        ownProps: { ...collapsedStateProps, className: styles.control },
                        slotProps: controlSlotProps,
                        ownerState,
                    })}
                >
                    <BaseCombobox.Input
                        {...resolveSlotProps({
                            ownProps: { ...collapsedAriaProps, ...inputProps, placeholder, className: styles.input },
                            slotProps: inputSlotProps,
                            ownerState,
                        })}
                    />
                    {hasContent(clearLabel) && !readOnly && (
                        <BaseCombobox.Clear
                            {...resolveSlotProps({
                                ownProps: { className: styles.clear, "aria-label": clearLabel },
                                slotProps: clearSlotProps,
                                ownerState,
                            })}
                        >
                            <Icon name="close" className={styles.buttonIcon} />
                        </BaseCombobox.Clear>
                    )}
                    <BaseCombobox.Trigger
                        {...resolveSlotProps({
                            ownProps: { ...collapsedAriaProps, className: styles.trigger },
                            slotProps: triggerSlotProps,
                            ownerState,
                        })}
                    >
                        <Icon name="chevron-down" className={styles.buttonIcon} />
                    </BaseCombobox.Trigger>
                </BaseCombobox.InputGroup>
                <BaseCombobox.Portal>
                    <BaseCombobox.Positioner
                        {...resolveSlotProps({
                            ownProps: { ...popupTheme, ...(isListHidden && { hidden: true }), className: styles.positioner, sideOffset: 4 },
                            slotProps: positionerSlotProps,
                            ownerState,
                        })}
                    >
                        <BaseCombobox.Popup {...resolveSlotProps({ ownProps: { className: styles.popup }, slotProps: popupSlotProps, ownerState })}>
                            <BaseCombobox.Empty
                                {...resolveSlotProps({ ownProps: { className: styles.empty }, slotProps: emptySlotProps, ownerState })}
                            >
                                {emptyMessage}
                            </BaseCombobox.Empty>
                            <BaseCombobox.List {...resolveSlotProps({ ownProps: { className: styles.list }, slotProps: listSlotProps, ownerState })}>
                                {(option: AutocompleteOption) => (
                                    <BaseCombobox.Item
                                        key={option.value}
                                        {...resolveSlotProps({
                                            ownProps: { className: styles.option, disabled: option.disabled },
                                            slotProps: optionSlotProps,
                                            ownerState,
                                        })}
                                        value={option.value}
                                    >
                                        <SlotElement
                                            tagName="span"
                                            {...resolveSlotProps({
                                                ownProps: { className: styles.optionText },
                                                slotProps: optionTextSlotProps,
                                                ownerState,
                                            })}
                                        >
                                            {option.label}
                                        </SlotElement>
                                        <BaseCombobox.ItemIndicator
                                            {...resolveSlotProps({
                                                ownProps: { className: styles.optionIndicator },
                                                slotProps: optionIndicatorSlotProps,
                                                ownerState,
                                            })}
                                        >
                                            <Icon name="check" />
                                        </BaseCombobox.ItemIndicator>
                                    </BaseCombobox.Item>
                                )}
                            </BaseCombobox.List>
                        </BaseCombobox.Popup>
                    </BaseCombobox.Positioner>
                </BaseCombobox.Portal>
            </BaseCombobox.Root>
        </FormField>
    );
}

/** Resolves the slot props of FormField's parts with the autocomplete's owner state, which FormField doesn't know. */
function resolveFormFieldSlotProps<PartProps>(
    slotProps: SlotProps<PartProps, AutocompleteOwnerState> | undefined,
    ownerState: AutocompleteOwnerState,
) {
    return typeof slotProps === "function" ? slotProps(ownerState) : slotProps;
}

/** Tells the autocomplete whether any option matches the input, as Base UI filters them inside the root. */
function FilterObserver({ onHasMatchesChange }: { onHasMatchesChange: (hasMatches: boolean) => void }) {
    const hasMatches = BaseCombobox.useFilteredItems().length > 0;
    useLayoutEffect(() => onHasMatchesChange(hasMatches), [hasMatches, onHasMatchesChange]);
    return null;
}
