import { AutocompleteProps } from "@mui/material";
import React from "react";

import { AsyncOptionsProps } from "../../hooks/useAsyncOptionsProps";
import FinalFormAutocomplete from "../Autocomplete";
import { Field, FieldProps } from "../Field";

export type AutocompleteFieldProps<
    T extends Record<string, any>,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined,
> = FieldProps<T, HTMLInputElement | HTMLTextAreaElement> &
    Partial<AsyncOptionsProps<T>> &
    Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, "renderInput"> & {
        clearable?: boolean;
    };

export function AutocompleteField<
    T extends Record<string, any>,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined,
>(props: AutocompleteFieldProps<T, Multiple, DisableClearable, FreeSolo>) {
    return <Field component={FinalFormAutocomplete} {...props} />;
}
