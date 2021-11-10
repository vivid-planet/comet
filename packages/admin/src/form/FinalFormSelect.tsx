import { SelectProps } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

import { Select } from "./Select";

interface FinalFormSelectProps<T> extends FieldRenderProps<T, HTMLInputElement | HTMLTextAreaElement> {
    optionLabelKey?: keyof T;
}

export const FinalFormSelect = <T extends Record<string, any>>({
    input: { checked, value, name, onChange, onFocus, onBlur, ...restInput },
    meta,
    optionLabelKey = "label",
    options = null,
    loading = false,
    ...rest
}: FinalFormSelectProps<T> & Omit<SelectProps, "input">) => {
    if (options === null) {
        return <Select {...rest} name={name} onChange={onChange} value={value} onFocus={onFocus} onBlur={onBlur} />;
    }

    const getOptionLabel = (option: T) => {
        if (!optionLabelKey || option[optionLabelKey] === undefined) {
            throw new Error(`"${optionLabelKey}" is not a key in the options-prop, please set the prop "optionLabelKey" accordingly.`);
        }
        return option[optionLabelKey].toString();
    };

    return (
        <Select {...rest} name={name} onChange={onChange} value={value} onFocus={onFocus} onBlur={onBlur}>
            {options.length === 0 && value /* @ts-ignore - necessary to load object into value */ && (
                <MenuItem value={value} key={JSON.stringify(value)}>
                    {getOptionLabel(value)}
                </MenuItem>
            )}
            {options.map((option: T) /* @ts-ignore - necessary to load object into value */ => (
                <MenuItem value={option} key={JSON.stringify(option)}>
                    {getOptionLabel(option)}
                </MenuItem>
            ))}
        </Select>
    );
};
