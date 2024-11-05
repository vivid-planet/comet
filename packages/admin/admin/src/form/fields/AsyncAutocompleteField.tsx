import { AutocompleteProps } from "@mui/material";

import { Field, FieldProps } from "../Field";
import { FinalFormAsyncAutocomplete } from "../FinalFormAsyncAutocomplete";

export type AsyncAutocompleteFieldProps<
    T extends Record<string, any>,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined,
> = FieldProps<T, HTMLInputElement | HTMLTextAreaElement> & {
    loadOptions: () => Promise<T[]>;
} & Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, "options" | "renderInput"> & {
        clearable?: boolean;
    };

export function AsyncAutocompleteField<
    T extends Record<string, any>,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined,
>(props: AsyncAutocompleteFieldProps<T, Multiple, DisableClearable, FreeSolo>) {
    return <Field component={FinalFormAsyncAutocomplete} {...props} />;
}
