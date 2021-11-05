import { SelectProps } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

import { Select } from "./Select";

interface FinalFormSelectProps<T> extends FieldRenderProps<T, HTMLInputElement | HTMLTextAreaElement> {
    optionValue?: keyof T;
    optionLabel?: keyof T;
}

export const FinalFormSelect = <T extends Record<string, any>>({
    input: { checked, value, name, onChange, onFocus, onBlur, ...restInput },
    meta,
    optionLabel = "label",
    optionValue = "value",
    options = null,
    isAsync = false,
    loading = false,
    ...rest
}: FinalFormSelectProps<T> & Omit<SelectProps, "input">) => {
    if (options === null) {
        return <Select {...rest} name={name} onChange={onChange} value={value} onFocus={onFocus} onBlur={onBlur} />;
    }
    return (
        <Select {...rest} name={name} onChange={onChange} value={value} onFocus={onFocus} onBlur={onBlur}>
            {options.length === 0 && value /* @ts-ignore - necessary to load object into value */ && (
                <MenuItem value={value} key={value[optionValue]}>
                    {value[optionLabel]}
                </MenuItem>
            )}
            {options.map((option: T) /* @ts-ignore - necessary to load object into value */ => (
                <MenuItem value={option} key={option[optionValue]}>
                    {option[optionLabel]}
                </MenuItem>
            ))}
        </Select>
    );
};
