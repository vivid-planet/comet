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
    input: { checked, value, name, onChange, onFocus, onBlur, multiple, ...restInput },
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
        if ((option as any).id) return String((option as any).id);
        if ((option as any).value) return String((option as any).value);
        return JSON.stringify(option);
    },
    children,
    endAdornment,
    clearable,
    ...rest
}: FinalFormSelectProps<T> & Partial<AsyncOptionsProps<T>> & Omit<SelectProps, "input">) => {
    const selectEndAdornment = clearable ? (
        <>
            <ClearInputAdornment position="end" hasClearableContent={Boolean(value)} onClick={() => onChange(undefined)} />
            {endAdornment}
        </>
    ) : (
        endAdornment
    );

    if (children) {
        return (
            <Select
                {...rest}
                endAdornment={selectEndAdornment}
                name={name}
                onChange={onChange}
                value={value}
                onFocus={onFocus}
                onBlur={onBlur}
                multiple={multiple}
            >
                {children}
            </Select>
        );
    }

    return (
        <Select
            {...rest}
            endAdornment={
                <>
                    {loading && (
                        <InputAdornment position="end">
                            <CircularProgress size={16} color="inherit" />
                        </InputAdornment>
                    )}
                    {selectEndAdornment}
                </>
            }
            name={name}
            onChange={(event) => {
                const value = event.target.value;
                onChange(
                    Array.isArray(value)
                        ? value.map((v) => options.find((i) => getOptionValue(i) == v))
                        : options.find((i) => getOptionValue(i) == value),
                );
            }}
            value={Array.isArray(value) ? value.map((i) => getOptionValue(i)) : getOptionValue(value)}
            onFocus={onFocus}
            onBlur={onBlur}
            multiple={multiple}
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
