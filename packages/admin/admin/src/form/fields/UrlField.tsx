import { Field, type FieldProps } from "../Field";
import { FinalFormUrlInput, type FinalFormUrlInputProps } from "../FinalFormUrlInput";
import { validateUrl } from "../helpers/urlProtocol";

export type UrlFieldProps = FieldProps<string, HTMLInputElement> & FinalFormUrlInputProps;

export const UrlField = ({ validate, ...props }: UrlFieldProps) => {
    return <Field component={FinalFormUrlInput} validate={validate ?? validateUrl} {...props} />;
};
