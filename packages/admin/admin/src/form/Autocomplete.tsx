import { ChevronDown } from "@comet/admin-icons";
import { Autocomplete, AutocompleteProps, AutocompleteRenderInputParams, CircularProgress, InputBase } from "@mui/material";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

import { ClearInputAdornment } from "../common/ClearInputAdornment";
import { AsyncOptionsProps } from "../hooks/useAsyncOptionsProps";

export type FinalFormAutocompleteProps<
    T extends Record<string, any>,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined,
> = FieldRenderProps<T, HTMLInputElement | HTMLTextAreaElement> &
    Partial<AsyncOptionsProps<T>> &
    Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, "renderInput"> & {
        clearable?: boolean;
    };

export const FinalFormAutocomplete = <
    T extends Record<string, any>,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined,
>({
    input: { onChange, value, multiple, ...restInput },
    loading = false,
    isAsync = false,
    clearable,
    popupIcon = <ChevronDown />,
    ...rest
}: FinalFormAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>) => {
    return (
        <Autocomplete
            popupIcon={popupIcon}
            disableClearable
            isOptionEqualToValue={(option: T, value: T) => {
                if (!value) return false;
                return option === value;
            }}
            onChange={(_e, option) => {
                onChange(option);
            }}
            value={value ? (value as T) : (null as any)}
            {...rest}
            multiple={multiple as Multiple}
            renderInput={(params: AutocompleteRenderInputParams) => (
                <InputBase
                    {...restInput}
                    {...params}
                    {...params.InputProps}
                    endAdornment={
                        loading || clearable ? (
                            <>
                                {loading && <CircularProgress color="inherit" size={16} />}
                                {clearable && (
                                    <ClearInputAdornment position="end" hasClearableContent={Boolean(value)} onClick={() => onChange("")} />
                                )}
                                {params.InputProps.endAdornment}
                            </>
                        ) : (
                            params.InputProps.endAdornment
                        )
                    }
                />
            )}
        />
    );
};

export default FinalFormAutocomplete;
