import { FormattedMessage } from "react-intl";

interface InputProps {
    label: React.ReactNode;
    required?: boolean;
    placeholder?: string;
    helperText?: string;
    textArea?: boolean;
}

export function InputField({ label, required = false, placeholder, helperText, textArea = false }: InputProps): React.ReactElement {
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
            {textArea ? <textarea required={required} placeholder={placeholder} /> : <input required={required} placeholder={placeholder} />}
            {helperText && <div>{helperText}</div>}
        </div>
    );
}
