import { Field, type FieldProps } from "../Field";
import { FinalFormInput, type FinalFormInputProps } from "../FinalFormInput";

export type TextFieldProps = FieldProps<string, HTMLInputElement> & FinalFormInputProps;
export const TextField = (props: TextFieldProps) => {
    return <Field component={FinalFormInput} {...props} />;
};
