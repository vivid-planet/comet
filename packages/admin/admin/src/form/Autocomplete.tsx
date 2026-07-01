import { ChevronDown, Error } from "@comet/admin-icons";
import {
    Autocomplete,
    autocompleteClasses,
    type AutocompleteProps,
    type AutocompleteRenderInputParams,
    CircularProgress,
    InputAdornment,
    InputBase,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import type { ReactNode } from "react";
import type { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { ClearInputAdornment } from "../common/ClearInputAdornment";
import type { AsyncAutocompleteOptionsProps } from "./useAsyncAutocompleteOptionsProps";

// Keeps flex-wrap: wrap so chips + input flow naturally on the same lines.
// padding-right reserves space for the absolutely positioned end adornment (clear + chevron ≈ 56px).
const MultipleInputBase = styled(InputBase)`
    && {
        flex-wrap: wrap;
        align-items: center;
        position: relative;
        padding-right: 56px;
    }
`;

// Absolutely positioned so it never wraps below chips regardless of how many are selected.
// Resets MUI's own absolute positioning on .MuiAutocomplete-endAdornment so it stays in our flex flow.
const MultipleEndAdornmentContainer = styled("div")`
    position: absolute;
    right: 0;
    /* Centered for single-row inputs (same as calc(50% - 14px) at 50px field height).
       For multi-row inputs the min() clamps to the first-row center so icons never drift into chips.
       14px = half the popup icon height (28px); 11px = (50px input row - 28px icon) / 2. */
    top: min(calc(50% - 14px), 11px);
    display: flex;
    align-items: center;

    & .${autocompleteClasses.endAdornment} {
        position: static;
        transform: none;
    }
`;

export type FinalFormAutocompleteProps<
    T extends Record<string, any>,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined,
> = Partial<AsyncAutocompleteOptionsProps<T>> &
    Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, "renderInput"> & {
        errorText?: ReactNode;
        required?: boolean;
        disabled?: boolean;
        readOnly?: boolean;
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
    disabled,
    readOnly,
    loadingText = <FormattedMessage id="common.loading" defaultMessage="Loading ..." />,
    popupIcon = <ChevronDown />,
    noOptionsText = <FormattedMessage id="finalFormAutocomplete.noOptions" defaultMessage="No options." />,
    errorText = <FormattedMessage id="finalFormSelect.error" defaultMessage="Error loading options." />,
    required,
    ...rest
}: FinalFormAutocompleteProps<T, Multiple, DisableClearable, FreeSolo> & FinalFormAutocompleteInternalProps<T>) => {
    const value = multiple ? (Array.isArray(incomingValue) ? incomingValue : []) : incomingValue;
    const clearable = !required && !disabled && !readOnly;

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
                if (!value) {
                    return false;
                }
                return option === value;
            }}
            onChange={(_e, option) => {
                onChange(option);
            }}
            value={value ? (value as T) : (null as any)}
            {...rest}
            disabled={disabled}
            readOnly={readOnly}
            multiple={multiple as Multiple}
            renderInput={(params: AutocompleteRenderInputParams) => {
                const RenderedInputBase = multiple ? MultipleInputBase : InputBase;
                return (
                    <RenderedInputBase
                        {...restInput}
                        {...params}
                        {...params.InputProps}
                        // Disable HTML required for multiple select as the input stays empty (values are shown for example as chips) and the input is used for the autocomplete input
                        required={multiple ? false : required}
                        endAdornment={
                            multiple ? (
                                <MultipleEndAdornmentContainer>
                                    {loading && <CircularProgress color="inherit" size={16} />}
                                    {clearable && value && <ClearInputAdornment position="end" onClick={() => onChange("")} />}
                                    {loadingError && <Error color="error" />}
                                    {params.InputProps.endAdornment}
                                </MultipleEndAdornmentContainer>
                            ) : (
                                <InputAdornment position="end">
                                    {loading && <CircularProgress color="inherit" size={16} />}
                                    {clearable && value && <ClearInputAdornment position="end" onClick={() => onChange("")} />}
                                    {loadingError && <Error color="error" />}
                                    {params.InputProps.endAdornment}
                                </InputAdornment>
                            )
                        }
                    />
                );
            }}
        />
    );
};
