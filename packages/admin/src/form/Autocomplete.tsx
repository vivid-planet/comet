import { CircularProgress, TextField } from "@material-ui/core";
import Autocomplete, { AutocompleteProps, AutocompleteRenderInputParams } from "@material-ui/lab/Autocomplete";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

interface Props<T> extends FieldRenderProps<T, HTMLInputElement | HTMLTextAreaElement> {
    optionLabelKey?: keyof T;
}

export const FinalFormAutocomplete = <
    T extends Record<string, any>,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined,
>({
    input: { onChange, value, ...restInput },
    optionLabelKey = "label",
    loading = false,
    isAsync = false,
    ...rest
}: Props<T> & Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, "renderInput">) => {
    return (
        <Autocomplete
            getOptionSelected={(option: T, value: T) => {
                if (!value) return false;
                return option === value;
            }}
            getOptionLabel={(option: T) => {
                if (!optionLabelKey || option[optionLabelKey] === undefined) {
                    throw new Error(`"${optionLabelKey}" is not a key in the options-prop, please set the prop "optionLabelKey" accordingly.`);
                }
                return option[optionLabelKey].toString();
            }}
            onChange={(_e, option) => {
                onChange(option);
            }}
            value={value ? (value as T) : (null as any)}
            {...rest}
            renderInput={(params: AutocompleteRenderInputParams) => (
                <TextField
                    {...restInput}
                    {...params}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={16} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    );
};

export default FinalFormAutocomplete;
