import { type SelectProps } from "@mui/material";

import { useAsyncOptionsProps } from "../hooks/useAsyncOptionsProps";
import { FinalFormSelect, type FinalFormSelectProps } from "./FinalFormSelect";

export interface FinalFormAsyncSelectProps<T> extends FinalFormSelectProps<T>, Omit<SelectProps, "input"> {
    loadOptions: () => Promise<T[]>;
}

export function FinalFormAsyncSelect<T>({ loadOptions, ...rest }: FinalFormAsyncSelectProps<T>) {
    return <FinalFormSelect<T> {...useAsyncOptionsProps(loadOptions)} {...rest} />;
}
