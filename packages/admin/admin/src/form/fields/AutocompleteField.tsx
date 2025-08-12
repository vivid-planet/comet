import { type AutocompleteProps } from "@mui/material";

import { type AsyncOptionsProps } from "../../hooks/useAsyncOptionsProps";
import { FinalFormAutocomplete } from "../Autocomplete";
import { Field, type FieldProps } from "../Field";

export type AutocompleteFieldProps<
    FormValues,
    T extends Record<string, any>,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined,
> = FieldProps<FormValues, T, HTMLInputElement | HTMLTextAreaElement> &
    Partial<AsyncOptionsProps<T>> &
    Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, "renderInput"> & {
        clearable?: boolean;
    };

export function AutocompleteField<
    FormValues,
    T extends Record<string, any>,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined,
>(props: AutocompleteFieldProps<FormValues, T, Multiple, DisableClearable, FreeSolo>) {
    return <Field component={FinalFormAutocomplete} {...props} />;
}
