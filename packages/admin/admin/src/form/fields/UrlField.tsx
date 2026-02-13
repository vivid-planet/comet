import { Field, type FieldProps } from "../Field";
import { FinalFormUrlInput, type FinalFormUrlInputProps } from "../FinalFormUrlInput";
import { type AllowedProtocols, validateUrl } from "../helpers/urlProtocol";

export type UrlFieldProps = FieldProps<string, HTMLInputElement> &
    FinalFormUrlInputProps & {
        /**
         * Configuration for allowed protocols in URL fields.
         * - string[]: Custom list of allowed protocol names (e.g., ["https", "http", "mailto"])
         * - "web-only": Only allows https and http protocols
         * - "all": Allows all protocols except dangerous ones (javascript, data, vbscript)
         * - undefined: Same as "all" (default behavior)
         */
        allowedProtocols?: AllowedProtocols;
    };

export const UrlField = ({ validate, allowedProtocols, ...props }: UrlFieldProps) => {
    const defaultValidate = (value: string | undefined) => validateUrl(value, allowedProtocols);
    return <Field component={FinalFormUrlInput} validate={validate ?? defaultValidate} {...props} />;
};
