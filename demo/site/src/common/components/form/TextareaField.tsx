import { forwardRef, type ReactNode, type TextareaHTMLAttributes } from "react";
import { FormattedMessage } from "react-intl";

interface InputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: ReactNode;
    required?: boolean;
    placeholder?: string;
    helperText?: ReactNode;
    error?: ReactNode;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, InputProps>(
    ({ label, required = false, placeholder, helperText, error, ...textareaProps }, ref) => {
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
                <textarea ref={ref} placeholder={placeholder} {...textareaProps} />
                {helperText && <div>{helperText}</div>}
                {error && <div style={{ color: "red" }}>{error}</div>}
            </div>
        );
    },
);
