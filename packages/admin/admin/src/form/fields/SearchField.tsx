import { Field, type FieldProps } from "../Field";
import { FinalFormSearchTextField } from "../FinalFormSearchTextField";

export type SearchFieldProps<FormValues> = FieldProps<FormValues, string, HTMLInputElement>;

export function SearchField<FormValues>({ ...restProps }: SearchFieldProps<FormValues>) {
    return <Field component={FinalFormSearchTextField} {...restProps} />;
}
