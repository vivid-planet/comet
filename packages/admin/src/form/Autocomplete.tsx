import { CircularProgress, TextField } from "@material-ui/core";
import Autocomplete, { AutocompleteProps, AutocompleteRenderInputParams } from "@material-ui/lab/Autocomplete";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

interface Props<T> extends FieldRenderProps<T, HTMLInputElement | HTMLTextAreaElement> {
    optionValue?: keyof T;
    optionLabel?: keyof T;
}

export const FinalFormAutocomplete = <
    T extends Record<string, any>,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined,
>({
    input: { onChange, value, ...restInput },
    optionLabel = "label",
    optionValue = "value",
    loading = false,
    isAsync = false,
    ...rest
}: Props<T> & Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, "renderInput">) => {
    return (
        <Autocomplete
            getOptionSelected={(option: T, value: T) => {
                if (!value) return false;
                return optionValue ? option[optionValue] === value[optionValue] : option === value;
            }}
            getOptionLabel={(option: T) => {
                return optionLabel && option[optionLabel] !== undefined ? option[optionLabel].toString() : "--unknown--";
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
