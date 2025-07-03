import { Error } from "@comet/admin-icons";
import { InputAdornment, MenuItem, Select, type SelectProps, Typography } from "@mui/material";
import { type ReactNode } from "react";
import { type FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { ClearInputAdornment } from "../common/ClearInputAdornment";
import { type AsyncOptionsProps } from "../hooks/useAsyncOptionsProps";
import { MenuItemDisabledOverrideOpacity } from "./FinalFormSelect.sc";

export interface FinalFormSelectProps<T> extends FieldRenderProps<T, HTMLInputElement | HTMLTextAreaElement> {
    noOptionsLabel?: ReactNode;
    errorLabel?: ReactNode;
    getOptionLabel?: (option: T) => string;
    getOptionValue?: (option: T) => string;
    children?: ReactNode;
    required?: boolean;
    loadingError?: Error | null;
}

const getHasClearableContent = (value: unknown, multiple: boolean | undefined) => {
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
    input: { checked, value, name, onChange, onFocus, onBlur, ...restInput },
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

    noOptionsLabel = (
        <Typography variant="body2">
            <FormattedMessage id="finalFormSelect.noOptions" defaultMessage="No options." />
        </Typography>
    ),
    errorLabel = (
        <Typography variant="body2">
            <FormattedMessage id="finalFormSelect.error" defaultMessage="Error loading options." />
        </Typography>
    ),
    children,
    required,
    ...rest
}: FinalFormSelectProps<T> & Partial<AsyncOptionsProps<T>> & Omit<SelectProps, "input" | "endAdornment">) => {
    // Depending on the usage, `multiple` is either a root prop or in the `input` prop.
    // 1. <Field component={FinalFormSelect} multiple /> -> multiple is in restInput
    // 2. <Field>{(props) => <FinalFormSelect {...props} multiple />}</Field> -> multiple is in rest
    const multiple = restInput.multiple ?? rest.multiple;

    const endAdornment = !required ? (
        <ClearInputAdornment
            position="end"
            hasClearableContent={getHasClearableContent(value, multiple)}
            onClick={() => onChange(multiple ? [] : undefined)}
        />
    ) : null;

    const selectProps = {
        ...rest,
        multiple,
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
                    return value.map((i) => getOptionLabel(i));
                } else {
                    return getOptionLabel(value);
                }
            }}
        >
            {loading && (
                <MenuItemDisabledOverrideOpacity value="" disabled>
                    <FormattedMessage id="common.loading" defaultMessage="Loading ..." />
                </MenuItemDisabledOverrideOpacity>
            )}

            {options.length === 0 &&
                value &&
                (Array.isArray(value) ? (
                    value.map((v) => (
                        <MenuItem value={getOptionValue(v)} key={getOptionValue(v)} sx={{ display: "none" }}>
                            {getOptionLabel(v)}
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem value={getOptionValue(value)} key={getOptionValue(value)} sx={{ display: "none" }}>
                        {getOptionLabel(value)}
                    </MenuItem>
                ))}

            {loading === false && loadingError == null && options.length === 0 && (
                <MenuItemDisabledOverrideOpacity value="" disabled>
                    {noOptionsLabel}
                </MenuItemDisabledOverrideOpacity>
            )}
            {loading === false && loadingError != null && (
                <MenuItemDisabledOverrideOpacity value="" disabled>
                    {errorLabel}
                </MenuItemDisabledOverrideOpacity>
            )}

            {!loading &&
                options.map((option: T) => (
                    <MenuItem value={getOptionValue(option)} key={getOptionValue(option)}>
                        {getOptionLabel(option)}
                    </MenuItem>
                ))}
        </Select>
    );
};
