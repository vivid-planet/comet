import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

interface InputProps {
    label: ReactNode;
    required?: boolean;
    placeholder?: string;
    helperText?: ReactNode;
}

export function TextareaField({ label, required = false, placeholder, helperText }: InputProps): React.ReactElement {
    return (
        <div>
            <label>
                {label}
                {!required && (
                    <span>
                        <FormattedMessage id="inputField.optional" defaultMessage="(optional)" />
                    </span>
                )}
            </label>
            <textarea required={required} placeholder={placeholder} />
            {helperText && <div>{helperText}</div>}
        </div>
    );
}
