import { Field, type FieldProps } from "../Field";
import { FinalFormInput, type FinalFormInputProps } from "../FinalFormInput";

export type TextFieldProps<FormValues> = FieldProps<FormValues, string, HTMLInputElement> & FinalFormInputProps;
export function TextField<FormValues>(props: TextFieldProps<FormValues>) {
    return <Field<FormValues> component={FinalFormInput} {...props} />;
}
