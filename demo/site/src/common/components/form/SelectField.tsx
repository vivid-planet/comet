import { forwardRef, type ReactNode, type SelectHTMLAttributes } from "react";
import { FormattedMessage } from "react-intl";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: ReactNode;
    required?: boolean;
    helperText?: ReactNode;
    options: Array<{ value: string; label: ReactNode }>;
    placeholder?: ReactNode;
    error?: ReactNode;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
    (
        {
            label,
            required = false,
            helperText,
            options,
            placeholder = <FormattedMessage id="selectField.placeholder" defaultMessage="Select an option" />,
            error,
            ...selectProps
        },
        ref,
    ) => {
        return (
            <div>
                <label>
                    {label}
                    {!required && (
                        <span>
                            <FormattedMessage id="selectField.optional" defaultMessage="(optional)" />
                        </span>
                    )}
                </label>
                <select ref={ref} required={required} defaultValue="" {...selectProps}>
                    <option value="" disabled selected>
                        {placeholder}
                    </option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {helperText && <div>{helperText}</div>}
                {error && <div style={{ color: "red" }}>{error}</div>}
            </div>
        );
    },
);
