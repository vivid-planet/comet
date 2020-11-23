import { TextField } from "@material-ui/core";
import MuiAutocomplete, { AutocompleteProps } from "@material-ui/lab/Autocomplete";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

interface IProps extends FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement> {
    optionValue?: string;
    optionLabel?: string;
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

export const Autocomplete: React.FunctionComponent<
    IProps & AutocompleteProps<any, boolean | undefined, boolean | undefined, boolean | undefined>
> = ({ input: { name, onChange, value, ...restInput }, meta, optionLabel = "label", optionValue = "value", ...rest }) => (
    <MuiAutocomplete
        getOptionSelected={(option, value) => {
            if (!value) return false;
            return optionValue ? option[optionValue] === value[optionValue] : option === value;
        }}
        getOptionLabel={(option) => {
            return optionLabel ? option[optionLabel] : "--unknown--";
        }}
        value={value ? value : null}
        onChange={(_e, option) => {
            onChange(option);
        }}
        {...rest}
        renderInput={(params) => <TextField {...restInput} {...params} name={name} error={(meta.error || meta.submitError) && meta.touched} />}
    />
);

export default Autocomplete;
