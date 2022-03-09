import { CircularProgress, InputBase } from "@material-ui/core";
import Autocomplete, { AutocompleteProps, AutocompleteRenderInputParams } from "@material-ui/lab/Autocomplete";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

import { AsyncOptionsProps } from "../hooks/useAsyncOptionsProps";

export const FinalFormAutocomplete = <
    T extends Record<string, unknown>,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined,
>({
    input: { onChange, value, ...restInput },
    loading = false,
    isAsync = false,
    ...rest
}: FieldRenderProps<T, HTMLInputElement | HTMLTextAreaElement> &
    Partial<AsyncOptionsProps<T>> &
    Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, "renderInput">): React.ReactElement => {
    return (
        <Autocomplete
            getOptionSelected={(option: T, value: T) => {
                if (!value) return false;
                return option === value;
            }}
            onChange={(_e, option) => {
                onChange(option);
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value={value ? (value as T) : (null as any)}
            {...rest}
            renderInput={(params: AutocompleteRenderInputParams) => (
                <InputBase
                    {...restInput}
                    {...params}
                    {...params.InputProps}
                    endAdornment={
                        <React.Fragment>
                            {loading ? <CircularProgress color="inherit" size={16} /> : null}
                            {params.InputProps.endAdornment}
                        </React.Fragment>
                    }
                />
            )}
        />
    );
};

export default FinalFormAutocomplete;
