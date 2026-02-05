import { ChevronDown, Error } from "@comet/admin-icons";
import {
    Autocomplete,
    type AutocompleteProps,
    type AutocompleteRenderInputParams,
    CircularProgress,
    InputAdornment,
    InputBase,
    Typography,
} from "@mui/material";
import type { ReactNode } from "react";
import { type FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { ClearInputAdornment } from "../common/ClearInputAdornment";
import { type AsyncAutocompleteOptionsProps } from "./useAsyncAutocompleteOptionsProps";

export type FinalFormAutocompleteProps<
    T extends Record<string, any>,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined,
> = Partial<AsyncAutocompleteOptionsProps<T>> &
    Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, "renderInput"> & {
        clearable?: boolean;
        errorText?: ReactNode;
    };

type FinalFormAutocompleteInternalProps<T extends Record<string, any>> = FieldRenderProps<T, HTMLInputElement | HTMLTextAreaElement>;

/**
 * Final Form-compatible Autocomplete component.
 *
 * @see {@link AutocompleteField} – preferred for typical form use. Use this only if no Field wrapper is needed.
 */
export const FinalFormAutocomplete = <
    T extends Record<string, any>,
    Multiple extends boolean | undefined = false,
    DisableClearable extends boolean | undefined = false,
    FreeSolo extends boolean | undefined = false,
>({
    input: { onChange, value: incomingValue, multiple, ...restInput },
    loading = false,
    loadingError,
    isAsync = false,
    clearable,
    loadingText = <FormattedMessage id="common.loading" defaultMessage="Loading ..." />,
    popupIcon = <ChevronDown />,
    noOptionsText = <FormattedMessage id="finalFormAutocomplete.noOptions" defaultMessage="No options." />,
    errorText = <FormattedMessage id="finalFormSelect.error" defaultMessage="Error loading options." />,
    required,
    ...rest
}: FinalFormAutocompleteProps<T, Multiple, DisableClearable, FreeSolo> & FinalFormAutocompleteInternalProps<T>) => {
    const value = multiple ? (Array.isArray(incomingValue) ? incomingValue : []) : incomingValue;
    return (
        <Autocomplete
            popupIcon={popupIcon}
            disableClearable
            noOptionsText={
                loadingError ? (
                    <Typography variant="body2" component="span">
                        {errorText}
                    </Typography>
                ) : (
                    <Typography variant="body2" component="span">
                        {noOptionsText}
                    </Typography>
                )
            }
            loading={loading}
            loadingText={
                <Typography variant="body2" component="span">
                    {loadingText}
                </Typography>
            }
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
                    // Disable HTML required for multiple select as the input stays empty (values are shown for example chips) and the input is used for the autocomplete input
                    required={multiple ? false : required}
                    endAdornment={
                        <InputAdornment position="end">
                            {loading && <CircularProgress color="inherit" size={16} />}
                            {clearable && <ClearInputAdornment position="end" hasClearableContent={Boolean(value)} onClick={() => onChange("")} />}
                            {loadingError && <Error color="error" />}
                            {params.InputProps.endAdornment}
                        </InputAdornment>
                    }
                />
            )}
        />
    );
};
