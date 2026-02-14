import { Error } from "@comet/admin-icons";
import { InputAdornment, LinearProgress, MenuItem, Select, type SelectProps, Typography } from "@mui/material";
import { type ReactNode } from "react";
import { type FieldRenderProps } from "react-final-form";
import { FormattedMessage, type MessageDescriptor, useIntl } from "react-intl";

import { ClearInputAdornment } from "../common/ClearInputAdornment";
import { type AsyncOptionsProps } from "../hooks/useAsyncOptionsProps";
import { LinearLoadingContainer, MenuItemDisabledOverrideOpacity } from "./FinalFormSelect.sc";

export interface FinalFormSelectProps<T> {
    noOptionsText?: ReactNode;
    errorText?: ReactNode;
    /**
     * Function or FormatJS MessageDescriptor to get the label for an option.
     * 
     * When a function is provided, it receives the option object and returns a string.
     * 
     * When a MessageDescriptor is provided, it uses FormatJS `formatMessage` with the option object as values.
     * This allows using ICU message syntax for dynamic labels.
     * 
     * @example
     * // Function example
     * getOptionLabel={(option) => option.name}
     * 
     * @example
     * // MessageDescriptor example with template
     * getOptionLabel={{
     *   id: "product.manufacturer.label",
     *   defaultMessage: "{name}, {country}"
     * }}
     * 
     * @example
     * // MessageDescriptor with ICU formatting
     * getOptionLabel={{
     *   id: "person.label",
     *   defaultMessage: "{givenName} {familyName}, {birthDate, date, short}"
     * }}
     */
    getOptionLabel?: ((option: T) => string) | MessageDescriptor;
    getOptionValue?: (option: T) => string;
    children?: ReactNode;
    required?: boolean;
    loadingError?: Error | null;
}

type FinalFormSelectInternalProps<T> = FieldRenderProps<T, HTMLInputElement | HTMLTextAreaElement>;

const getHasClearableContent = (value: unknown, multiple: boolean | undefined, disabled: boolean | undefined) => {
    if (disabled) {
        return false;
    }
    if (multiple && Array.isArray(value)) {
        return value.length > 0;
    }

    return value !== undefined && value !== "";
};

/**
 * Final Form-compatible Select component.
 *
 * @see {@link SelectField} – preferred for typical form use. Use this only if no Field wrapper is needed.
 */
export const FinalFormSelect = <T,>({
    input: { checked, value: incomingValue, name, onChange, onFocus, onBlur, ...restInput },
    meta,
    isAsync = false,
    options = [],
    loading = false,
    loadingError,
    getOptionLabel = (option: T) => {
        if (typeof option === "object") {
            console.error(`The \`getOptionLabel\` method of FinalFormSelect returned an object instead of a string for${JSON.stringify(option)}.`);
        }
        return "";
    },
    getOptionValue = (option: T) => {
        if (typeof option === "object" && option !== null) {
            if ((option as any).id) return String((option as any).id);
            if ((option as any).value) return String((option as any).value);
            return JSON.stringify(option);
        } else {
            return String(option);
        }
    },

    noOptionsText = (
        <Typography variant="body2">
            <FormattedMessage id="finalFormSelect.noOptions" defaultMessage="No options." />
        </Typography>
    ),
    errorText = (
        <Typography variant="body2">
            <FormattedMessage id="finalFormSelect.error" defaultMessage="Error loading options." />
        </Typography>
    ),
    disabled,
    children,
    required,
    ...rest
}: FinalFormSelectProps<T> & FinalFormSelectInternalProps<T> & Partial<AsyncOptionsProps<T>> & Omit<SelectProps, "input" | "endAdornment">) => {
    const intl = useIntl();

    // Create a function to get the label for an option
    // Supports both function and MessageDescriptor (for FormatJS translation templates)
    const getLabel = (option: T): string => {
        if (typeof getOptionLabel === "function") {
            return getOptionLabel(option);
        } else {
            // getOptionLabel is a MessageDescriptor - use formatMessage with option as values
            // Note: Using 'as any' is intentional as FormatJS formatMessage accepts any object
            // The developer is responsible for ensuring the MessageDescriptor template references valid fields
            return intl.formatMessage(getOptionLabel, option as any);
        }
    };
    // Depending on the usage, `multiple` is either a root prop or in the `input` prop.
    // 1. <Field component={FinalFormSelect} multiple /> -> multiple is in restInput
    // 2. <Field>{(props) => <FinalFormSelect {...props} multiple />}</Field> -> multiple is in rest
    const multiple = restInput.multiple ?? rest.multiple;

    const value = multiple ? (Array.isArray(incomingValue) ? incomingValue : []) : incomingValue;

    const endAdornment = !required ? (
        <ClearInputAdornment
            position="end"
            hasClearableContent={getHasClearableContent(value, multiple, disabled)}
            onClick={() => onChange(multiple ? [] : undefined)}
        />
    ) : null;

    const selectProps = {
        ...rest,
        multiple,
        disabled,
        endAdornment,
        name,
        onChange,
        onFocus,
        onBlur,
        required,
    };

    if (children) {
        return (
            <Select {...selectProps} value={value}>
                {children}
            </Select>
        );
    }

    const showLoadingMessage = loading === true && options.length === 0 && loadingError == null;
    const showLinearProgress = loading === true && !showLoadingMessage;
    const showOptions = options.length > 0 && loadingError == null;
    const showError = loadingError != null && !loading;
    const showNoOptions = loading === false && loadingError == null && options.length === 0;

    return (
        <Select
            {...selectProps}
            endAdornment={
                <InputAdornment position="end">
                    {loadingError && <Error color="error" />}

                    {endAdornment}
                </InputAdornment>
            }
            onChange={(event) => {
                const value = event.target.value;
                onChange(
                    Array.isArray(value)
                        ? value.map((v) => options.find((i) => getOptionValue(i) == v))
                        : options.find((i) => getOptionValue(i) == value),
                );
            }}
            value={Array.isArray(value) ? value.map((i) => getOptionValue(i)) : getOptionValue(value)}
            renderValue={() => {
                if (Array.isArray(value)) {
                    const labels = value.map((i) => getLabel(i));
                    return intl.formatList(labels, { type: "conjunction" });
                } else {
                    return getLabel(value);
                }
            }}
        >
            <LinearLoadingContainer>{showLinearProgress && <LinearProgress />}</LinearLoadingContainer>
            {showLoadingMessage && (
                <MenuItemDisabledOverrideOpacity value="" disabled>
                    <FormattedMessage id="common.loading" defaultMessage="Loading ..." />
                </MenuItemDisabledOverrideOpacity>
            )}

            {options.length === 0 &&
                value &&
                (Array.isArray(value) ? (
                    value.map((v) => (
                        <MenuItem value={getOptionValue(v)} key={getOptionValue(v)} sx={{ display: "none" }}>
                            {getLabel(v)}
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem value={getOptionValue(value)} key={getOptionValue(value)} sx={{ display: "none" }}>
                        {getLabel(value)}
                    </MenuItem>
                ))}

            {showNoOptions && (
                <MenuItemDisabledOverrideOpacity value="" disabled>
                    {noOptionsText}
                </MenuItemDisabledOverrideOpacity>
            )}
            {showError && (
                <MenuItemDisabledOverrideOpacity value="" disabled>
                    {errorText}
                </MenuItemDisabledOverrideOpacity>
            )}

            {showOptions &&
                options.map((option: T) => (
                    <MenuItem value={getOptionValue(option)} key={getOptionValue(option)}>
                        {getLabel(option)}
                    </MenuItem>
                ))}
        </Select>
    );
};
