import { Field, type FieldProps } from "../Field";
import { FinalFormInput } from "../FinalFormInput";

export type TextAreaFieldProps<FormValues> = FieldProps<FormValues, string, HTMLTextAreaElement>;

export function TextAreaField<FormValues>({ ...restProps }: TextAreaFieldProps<FormValues>) {
    return <Field type="textarea" multiline rows={3} component={FinalFormInput} {...restProps} />;
}
