import { CircularProgress, InputAdornment, MenuItem, Select, SelectProps } from "@mui/material";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { ClearInputAdornment } from "../common/ClearInputAdornment";
import { AsyncOptionsProps } from "../hooks/useAsyncOptionsProps";

export interface FinalFormSelectProps<T> extends FieldRenderProps<T, HTMLInputElement | HTMLTextAreaElement> {
    getOptionLabel?: (option: T) => string;
    getOptionValue?: (option: T) => string;
    children?: React.ReactNode;
    clearable?: boolean;
}

export const FinalFormSelect = <T,>({
    input: { checked, value, name, onChange, onFocus, onBlur, ...restInput },
    meta,
    isAsync = false,
    options = [],
    loading = false,
    getOptionLabel = (option: T) => {
        if (typeof option === "object") {
            // eslint-disable-next-line no-console
            console.error(`The \`getOptionLabel\` method of FinalFormSelect returned an object instead of a string for${JSON.stringify(option)}.`);
        }
        return "";
    },
    getOptionValue = (option: T) => {
        if (typeof option === "object" && option !== null) {
            if ((option as any).id || (option as any).id === "") return String((option as any).id);
            if ((option as any).value) return String((option as any).value);
            return JSON.stringify(option);
        } else {
            return String(option);
        }
    },
    children,
    clearable,
    ...rest
}: FinalFormSelectProps<T> & Partial<AsyncOptionsProps<T>> & Omit<SelectProps, "input" | "endAdornment">) => {
    // Depending on the usage, `multiple` is either a root prop or in the `input` prop.
    // 1. <Field component={FinalFormSelect} multiple /> -> multiple is in restInput
    // 2. <Field>{(props) => <FinalFormSelect {...props} multiple />}</Field> -> multiple is in rest
    const multiple = restInput.multiple ?? rest.multiple;

    const endAdornment = clearable ? (
        <ClearInputAdornment
            position="end"
            hasClearableContent={Boolean(multiple ? (Array.isArray(value) ? value.length : value) : value)}
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
                <>
                    {loading && (
                        <InputAdornment position="end">
                            <CircularProgress size={16} color="inherit" />
                        </InputAdornment>
                    )}
                    {endAdornment}
                </>
            }
            onChange={(event) => {
                const value = event.target.value;

                if (Array.isArray(value)) {
                    onChange(value.map((v) => options.find((i) => getOptionValue(i) == v)));
                } else {
                    const selectedOption = options.find((i) => getOptionValue(i) == value);

                    if (selectedOption && getOptionValue(selectedOption) === "") {
                        onChange(undefined);
                    } else {
                        onChange(selectedOption);
                    }
                }
            }}
            value={Array.isArray(value) ? value.map((i) => getOptionValue(i)) : getOptionValue(value)}
        >
            {loading && (
                <MenuItem value="" disabled>
                    <FormattedMessage id="common.loading" defaultMessage="Loading ..." />
                </MenuItem>
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
            {options.map((option: T) => (
                <MenuItem value={getOptionValue(option)} key={getOptionValue(option)}>
                    {getOptionLabel(option)}
                </MenuItem>
            ))}
        </Select>
    );
};
