import { type AutocompleteProps } from "@mui/material";

import { Field, type FieldProps } from "../Field";
import { FinalFormAsyncAutocomplete } from "../FinalFormAsyncAutocomplete";

export type AsyncAutocompleteFieldProps<
    FormValues,
    T extends Record<string, any>,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined,
> = FieldProps<FormValues, T, HTMLInputElement | HTMLTextAreaElement> & {
    loadOptions: () => Promise<T[]>;
} & Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, "options" | "renderInput"> & {
        clearable?: boolean;
    };

export function AsyncAutocompleteField<
    FormValues,
    T extends Record<string, any>,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined,
>(props: AsyncAutocompleteFieldProps<FormValues, T, Multiple, DisableClearable, FreeSolo>) {
    return <Field component={FinalFormAsyncAutocomplete} {...props} />;
}
