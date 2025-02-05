import { Field, type FieldProps } from "../Field";
import { FinalFormInput } from "../FinalFormInput";

export type TextFieldProps = FieldProps<string, HTMLInputElement>;

export const TextField = (props: TextFieldProps) => {
    return <Field component={FinalFormInput} {...props} />;
};
