import { Field, type FieldProps } from "../Field";
import { FinalFormUrlInput, type FinalFormUrlInputProps } from "../FinalFormUrlInput";

export type UrlFieldProps = FieldProps<string, HTMLInputElement> & FinalFormUrlInputProps;

export const UrlField = (props: UrlFieldProps) => {
    return <Field component={FinalFormUrlInput} {...props} />;
};
