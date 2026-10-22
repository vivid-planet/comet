import { Icon, SelectControl, type SelectControlProps, type SelectOption } from "@dextinity/ui";
import { type ChangeEvent, Children, Fragment, isValidElement, type ReactNode, useRef } from "react";
import type { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import type { AsyncOptionsProps } from "../hooks/useAsyncOptionsProps";
import { InputClearButton } from "./InputClearButton";

export interface FinalFormSelectProps<T> {
    noOptionsText?: ReactNode;
    errorText?: ReactNode;
    getOptionLabel?: (option: T) => string;
    getOptionValue?: (option: T) => string;
    /**
     * The options as elements, such as `<option value="a">A</option>` or MUI's `<MenuItem value="a">A</MenuItem>`: each element's `value`,
     * `children` and `disabled` props become an option. The field's value is then the selected element's `value`.
     */
    children?: ReactNode;
    required?: boolean;
    loadingError?: Error | null;
    multiple?: boolean;
    disabled?: boolean;
    placeholder?: ReactNode;
    renderValue?: (value: unknown) => ReactNode;
    className?: string;
    /** @deprecated Has no effect: the select always fills its field. */
    fullWidth?: boolean;
}

type FinalFormSelectInternalProps<T> = FieldRenderProps<T, HTMLInputElement | HTMLTextAreaElement>;

type ElementOption = SelectOption & { originalValue: unknown };

function getElementOptions(children: ReactNode): ElementOption[] {
    return Children.toArray(children).flatMap((child): ElementOption[] => {
        if (!isValidElement<{ value?: unknown; children?: ReactNode; disabled?: boolean }>(child)) {
            return [];
        }
        if (child.type === Fragment) {
            return getElementOptions(child.props.children);
        }
        if (child.props.value === undefined) {
            return [];
        }
        return [{ value: String(child.props.value), label: child.props.children, disabled: child.props.disabled, originalValue: child.props.value }];
    });
}

function isEmptyValue(value: unknown) {
    return value === undefined || value === null || value === "";
}

function getDataAndAriaProps(props: Record<string, unknown>) {
    return Object.fromEntries(Object.entries(props).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}

/**
 * Final Form-compatible Select component.
 *
 * @see {@link SelectField} – preferred for typical form use. Use this only if no Field wrapper is needed.
 */
export const FinalFormSelect = <T,>({
    input: { value: incomingValue, name, onChange, onFocus, onBlur, multiple: inputMultiple },
    meta,
    isAsync = false,
    options = [],
    loading = false,
    loadingError,
    open,
    onOpen,
    onClose,
    getOptionLabel = (option: T) => {
        if (typeof option === "object") {
            console.error(`The \`getOptionLabel\` method of FinalFormSelect returned an object instead of a string for${JSON.stringify(option)}.`);
        }
        return "";
    },
    getOptionValue = (option: T) => {
        if (typeof option === "object" && option !== null) {
            if ((option as any).id) {
                return String((option as any).id);
            }
            if ((option as any).value) {
                return String((option as any).value);
            }
            return JSON.stringify(option);
        } else {
            return String(option);
        }
    },
    noOptionsText = <FormattedMessage id="dextinity.finalFormSelect.noOptions" defaultMessage="No options." />,
    errorText = <FormattedMessage id="dextinity.finalFormSelect.error" defaultMessage="Error loading options." />,
    disabled,
    children,
    required,
    multiple: propsMultiple,
    placeholder,
    renderValue,
    className,
    id,
    autoFocus,
    readOnly,
    inputProps,
    ...rest
}: FinalFormSelectProps<T> & FinalFormSelectInternalProps<T> & Partial<AsyncOptionsProps<T>>) => {
    // Depending on the usage, `multiple` is either a root prop or in the `input` prop.
    // 1. <Field component={FinalFormSelect} multiple /> -> multiple is in input
    // 2. <Field>{(props) => <FinalFormSelect {...props} multiple />}</Field> -> multiple is a root prop
    const multiple = Boolean(inputMultiple ?? propsMultiple);

    const value: unknown = multiple ? (Array.isArray(incomingValue) ? incomingValue : []) : incomingValue;

    const hasClearableContent = !disabled && (multiple && Array.isArray(value) ? value.length > 0 : !isEmptyValue(value));

    const clearButton = !required && hasClearableContent ? <InputClearButton onClick={() => onChange(multiple ? [] : undefined)} /> : null;

    // Focus moves from the trigger into the list while it's open, but the user hasn't left the field, so it isn't touched yet.
    const isOpenRef = useRef(false);

    const handleOpenChange: SelectControlProps["onOpenChange"] = (nextOpen, eventDetails) => {
        isOpenRef.current = nextOpen;
        if (!nextOpen && (eventDetails.reason === "outside-press" || eventDetails.reason === "focus-out")) {
            onBlur();
        }
        if (isAsync) {
            const event = eventDetails.event as unknown as ChangeEvent;
            if (nextOpen) {
                onOpen?.(event);
            } else {
                onClose?.(event);
            }
        }
    };

    const controlProps = {
        ...getDataAndAriaProps(rest),
        ...(inputProps && getDataAndAriaProps(inputProps)),
        id,
        autoFocus,
        readOnly,
        className,
        placeholder,
        multiple,
        disabled,
        required,
        name,
        onFocus,
        onBlur: () => {
            if (!isOpenRef.current) {
                onBlur();
            }
        },
        ...(isAsync && { open }),
        onOpenChange: handleOpenChange,
    };

    if (children) {
        const elementOptions = getElementOptions(children);
        const toKey = (optionValue: unknown) =>
            isEmptyValue(optionValue) && !elementOptions.some((option) => option.value === "") ? null : String(optionValue);
        const toOriginalValue = (key: string) => elementOptions.find((option) => option.value === key)?.originalValue ?? key;

        return (
            <SelectControl
                {...controlProps}
                options={elementOptions}
                value={Array.isArray(value) ? value.map((item) => String(item)) : toKey(value)}
                onValueChange={(newValue) => {
                    onChange(Array.isArray(newValue) ? newValue.map(toOriginalValue) : newValue === null ? undefined : toOriginalValue(newValue));
                }}
                endAdornment={clearButton}
                slotProps={renderValue ? { value: { children: () => renderValue(value) } } : undefined}
            />
        );
    }

    const showLoadingMessage = loading === true && loadingError == null;
    const showOptions = options.length > 0 && loadingError == null;
    const showError = loadingError != null && !loading;
    const showNoOptions = loading === false && loadingError == null && options.length === 0;

    const selectOptions: SelectOption[] = showOptions
        ? options.map((option) => ({ value: getOptionValue(option), label: getOptionLabel(option) }))
        : [];

    const renderSelectedLabels = () => {
        if (renderValue) {
            return renderValue(value);
        }
        if (Array.isArray(value)) {
            return value.map((item) => getOptionLabel(item)).join(", ");
        }
        return isEmptyValue(value) ? placeholder : getOptionLabel(value as T);
    };

    return (
        <SelectControl
            {...controlProps}
            options={selectOptions}
            value={Array.isArray(value) ? value.map((item) => getOptionValue(item)) : isEmptyValue(value) ? null : getOptionValue(value as T)}
            onValueChange={(newValue) => {
                onChange(
                    Array.isArray(newValue)
                        ? newValue.map((key) => options.find((option) => getOptionValue(option) == key))
                        : options.find((option) => getOptionValue(option) == newValue),
                );
            }}
            message={
                showLoadingMessage ? (
                    <FormattedMessage id="dextinity.common.loading" defaultMessage="Loading ..." />
                ) : showError ? (
                    errorText
                ) : showNoOptions ? (
                    noOptionsText
                ) : undefined
            }
            endAdornment={
                loadingError || clearButton ? (
                    <>
                        {loadingError && <Icon name="danger" />}
                        {clearButton}
                    </>
                ) : undefined
            }
            slotProps={{ value: { children: renderSelectedLabels } }}
        />
    );
};
