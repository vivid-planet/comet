import { ChevronDown } from "@comet/admin-icons";
import { Autocomplete, type AutocompleteProps, type AutocompleteRenderInputParams, CircularProgress, InputBase, Typography } from "@mui/material";
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
    };

type FinalFormAutocompleteInternalProps<T extends Record<string, any>> = FieldRenderProps<T, HTMLInputElement | HTMLTextAreaElement>;

/**
 * Final Form-compatible Autocomplete component.
 *
 * @see {@link AutocompleteField} – preferred for typical form use. Use this only if no Field wrapper is needed.
 */
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
    noOptionsText = <FormattedMessage id="finalFormAutocomplete.noOptions" defaultMessage="No options." />,
    ...rest
}: FinalFormAutocompleteProps<T, Multiple, DisableClearable, FreeSolo> & FinalFormAutocompleteInternalProps<T>) => {
    return (
        <Autocomplete
            popupIcon={popupIcon}
            disableClearable
            noOptionsText={
                <Typography variant="body2" component="span">
                    {noOptionsText}
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
