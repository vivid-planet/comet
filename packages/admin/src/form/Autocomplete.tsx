import { TextField } from "@material-ui/core";
import MuiAutocomplete, { AutocompleteProps } from "@material-ui/lab/Autocomplete";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

interface IProps<T> extends FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement> {
    optionValue?: keyof T;
    optionLabel?: keyof T;
}

interface AutocompleteAsyncProps<T> {
    open: boolean;
    options: T[];
    loading: boolean;
    onOpen: (event: React.ChangeEvent<{}>) => void;
    onClose: (event: React.ChangeEvent<{}>) => void;
}

export function useAutocompleteAsyncProps<T>(loadOptions: () => Promise<T[]>): AutocompleteAsyncProps<T> {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<T[]>([]);
    const loading = open && options.length === 0;

    React.useEffect(() => {
        let active = true;
        if (!loading) {
            return undefined;
        }
        (async () => {
            const response = await loadOptions();
            if (active) {
                setOptions(response);
            }
        })();
        return () => {
            active = false;
        };
    }, [loadOptions, loading]);
    return {
        open,
        options,
        loading,
        onOpen: () => setOpen(true),
        onClose: () => setOpen(false),
    };
}

export const Autocomplete = <
    T extends Record<string, any>,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined
>({
    input: { name, onChange, value, ...restInput },
    meta,
    optionLabel = "label",
    optionValue = "value",
    ...rest
}: IProps<T> & AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>) => (
    <MuiAutocomplete
        getOptionSelected={(option: T, value: T) => {
            if (!value) return false;
            return optionValue ? option[optionValue] === value[optionValue] : option === value;
        }}
        getOptionLabel={(option: T) => {
            return optionLabel && option[optionLabel] !== undefined ? option[optionLabel].toString() : "--unknown--";
        }}
        onChange={(_e, option) => {
            onChange(option);
        }}
        {...rest}
        renderInput={(params) => <TextField {...restInput} {...params} name={name} error={(meta.error || meta.submitError) && meta.touched} />}
    />
);

export default Autocomplete;
