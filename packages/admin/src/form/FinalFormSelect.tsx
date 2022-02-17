import { CircularProgress, SelectProps } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

import { AsyncOptionsProps } from "../hooks/useAsyncOptionsProps";
import { Select } from "./Select";

export interface FinalFormSelectProps<T> extends FieldRenderProps<T, HTMLInputElement | HTMLTextAreaElement> {
    getOptionSelected?: (option: T, value: T) => boolean;
    getOptionLabel?: (option: T) => string;
    children?: React.ReactNode;
}

export const FinalFormSelect = <T extends Record<string, any>>({
    input: { checked, value, name, onChange, onFocus, onBlur, ...restInput },
    meta,
    isAsync = false,
    options = [],
    loading = false,
    getOptionLabel = (option: T) => {
        if (typeof option === "object") {
            console.error(`The \`getOptionLabel\` method of FinalFormSelect returned an object instead of a string for${JSON.stringify(option)}.`);
        }
        return "";
    },
    getOptionSelected = (option: T, value: T) => {
        if (!value) return false;
        return option === value;
    },
    children,
    ...rest
}: FinalFormSelectProps<T> & Partial<AsyncOptionsProps<T>> & Omit<SelectProps, "input">) => {
    if (children) {
        return (
            <Select {...rest} name={name} onChange={onChange} value={value} onFocus={onFocus} onBlur={onBlur}>
                {children}
            </Select>
        );
    }

    if (value && options) {
        value = options.reduce((previousOption, option) => (getOptionSelected(option, value) ? option : previousOption), value);
    }

    return (
        <Select {...rest} name={name} onChange={onChange} value={value} onFocus={onFocus} onBlur={onBlur}>
            {options.length === 0 && (loading || value) && (
                <MenuItem value={value as any} key={JSON.stringify(value)}>
                    {loading ? <CircularProgress size="20px" style={{ marginLeft: "16px" }} /> : getOptionLabel(value)}
                </MenuItem>
            )}
            {options.map((option: T) => (
                <MenuItem value={option as any} key={JSON.stringify(option)}>
                    {getOptionLabel(option)}
                </MenuItem>
            ))}
        </Select>
    );
};
