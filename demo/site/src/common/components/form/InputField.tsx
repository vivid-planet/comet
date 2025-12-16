import { forwardRef, type InputHTMLAttributes } from "react";
import { FormattedMessage } from "react-intl";

interface InputProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label: React.ReactNode;
    required?: boolean;
    placeholder?: string;
    helperText?: string;
    textArea?: boolean;
    error?: string;
}

export const InputField = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
    ({ label, required = false, placeholder, helperText, textArea = false, error, ...rest }, ref) => {
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
                {textArea ? (
                    <textarea ref={ref as React.Ref<HTMLTextAreaElement>} required={required} placeholder={placeholder} {...rest} />
                ) : (
                    <input ref={ref as React.Ref<HTMLInputElement>} required={required} placeholder={placeholder} {...rest} />
                )}
                {error && <div style={{ color: "red" }}>{error}</div>}
                {helperText && <div>{helperText}</div>}
            </div>
        );
    },
);
