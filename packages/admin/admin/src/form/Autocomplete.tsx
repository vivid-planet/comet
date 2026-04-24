import { ChevronDown, Error } from "@comet/admin-icons";
import {
    Autocomplete,
    autocompleteClasses,
    type AutocompleteProps,
    type AutocompleteRenderInputParams,
    CircularProgress,
    generateUtilityClasses,
    InputAdornment,
    InputBase,
    Typography,
} from "@mui/material";
import { type ComponentsOverrides, css, type Theme } from "@mui/material/styles";
import type { ReactNode } from "react";
import type { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { ClearInputAdornment } from "../common/ClearInputAdornment";
import { createComponentSlot } from "../helpers/createComponentSlot";
import type { AsyncAutocompleteOptionsProps } from "./useAsyncAutocompleteOptionsProps";

export type FinalFormAutocompleteClassKey = "multipleInputBase" | "multipleStartAdornmentContainer";

export const finalFormAutocompleteClasses = generateUtilityClasses<FinalFormAutocompleteClassKey>("CometAdminFinalFormAutocomplete", [
    "multipleInputBase",
    "multipleStartAdornmentContainer",
]);

const MultipleInputBase = createComponentSlot(InputBase)<FinalFormAutocompleteClassKey>({
    componentName: "FinalFormAutocomplete",
    slotName: "multipleInputBase",
})(css`
    && {
        flex-wrap: nowrap;
        align-items: center;
    }
`);

const MultipleStartAdornmentContainer = createComponentSlot("div")<FinalFormAutocompleteClassKey>({
    componentName: "FinalFormAutocomplete",
    slotName: "multipleStartAdornmentContainer",
})(
    ({ theme }) => css`
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: ${theme.spacing(0.5)};
        flex: 1 1 auto;
        min-width: 0;

        & ~ .${autocompleteClasses.input} {
            flex-grow: 0;
        }
    `,
);

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
                            startAdornment={
                            multiple && params.InputProps.startAdornment ? (
                                <MultipleStartAdornmentContainer>{params.InputProps.startAdornment}</MultipleStartAdornmentContainer>
                            ) : (
                                params.InputProps.startAdornment
                            )
                        }
                        endAdornment={
                            <InputAdornment position="end">
                                {loading && <CircularProgress color="inherit" size={16} />}
                                {clearable && value && <ClearInputAdornment position="end" onClick={() => onChange("")} />}
                                {loadingError && <Error color="error" />}
                                {params.InputProps.endAdornment}
                            </InputAdornment>
                        }
                    />
                );
            }}
        />
    );
};

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminFinalFormAutocomplete: FinalFormAutocompleteClassKey;
    }

    interface Components {
        CometAdminFinalFormAutocomplete?: {
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFinalFormAutocomplete"];
        };
    }
}
