import { CircularProgress, SelectProps } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

import { AsyncOptionsProps } from "../hooks/useAsyncOptionsProps";
import { Select } from "./Select";

interface FinalFormSelectProps<T> extends FieldRenderProps<T, HTMLInputElement | HTMLTextAreaElement> {
    getOptionLabel?: (option: T) => string;
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
    ...rest
}: FinalFormSelectProps<T> & Partial<AsyncOptionsProps<T>> & Omit<SelectProps, "input">) => {
    if (!isAsync && !options) {
        return <Select {...rest} name={name} onChange={onChange} value={value} onFocus={onFocus} onBlur={onBlur} />;
    }

    return (
        <Select {...rest} name={name} onChange={onChange} value={value} onFocus={onFocus} onBlur={onBlur}>
            {loading && <CircularProgress size="20px" style={{ marginLeft: "16px" }} />}
            {!loading && options.length === 0 && value && (
                <MenuItem value={value as any} key={JSON.stringify(value)}>
                    {getOptionLabel(value)}
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
