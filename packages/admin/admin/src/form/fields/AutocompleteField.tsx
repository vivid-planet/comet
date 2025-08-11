import { FinalFormAutocomplete, type FinalFormAutocompleteProps } from "../Autocomplete";
import { Field, type FieldProps } from "../Field";

export type AutocompleteFieldProps<
    T extends Record<string, any>,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined,
> = FieldProps<T, HTMLInputElement | HTMLTextAreaElement> & FinalFormAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>;

export function AutocompleteField<
    T extends Record<string, any>,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined,
>(props: AutocompleteFieldProps<T, Multiple, DisableClearable, FreeSolo>) {
    return <Field component={FinalFormAutocomplete} {...props} />;
}
