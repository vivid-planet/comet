import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: ReactNode;
    required?: boolean;
    placeholder?: string;
    helperText?: ReactNode;
    error?: ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, InputProps>(
    ({ label, required = false, placeholder, helperText, error, ...inputProps }, ref) => {
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
                <input ref={ref} required={required} placeholder={placeholder} {...inputProps} />
                {helperText && <div>{helperText}</div>}
                {error && <div style={{ color: "red" }}>{error}</div>}
            </div>
        );
    },
);
