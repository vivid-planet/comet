import { useAsyncOptionsProps } from "../hooks/useAsyncOptionsProps";
import { FinalFormAutocomplete, FinalFormAutocompleteProps } from "./Autocomplete";

export interface FinalFormAsyncAutocompleteProps<
    T extends Record<string, any>,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined,
> extends FinalFormAutocompleteProps<T, Multiple, DisableClearable, FreeSolo> {
    loadOptions: () => Promise<T[]>;
}

export function FinalFormAsyncAutocomplete<
    T extends Record<string, any>,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined,
>({ loadOptions, ...rest }: FinalFormAsyncAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>) {
    return <FinalFormAutocomplete<T, Multiple, DisableClearable, FreeSolo> {...useAsyncOptionsProps(loadOptions)} {...rest} />;
}
