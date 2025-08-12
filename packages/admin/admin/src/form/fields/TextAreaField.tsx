import { Field, type FieldProps } from "../Field";
import { FinalFormInput, type FinalFormInputProps } from "../FinalFormInput";

export type TextAreaFieldProps = FieldProps<string, HTMLTextAreaElement> & FinalFormInputProps;

export const TextAreaField = ({ ...restProps }: TextAreaFieldProps) => {
    return <Field type="textarea" multiline rows={3} component={FinalFormInput} {...restProps} />;
};
