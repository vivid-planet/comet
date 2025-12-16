import { SvgUse } from "@src/common/helpers/SvgUse";
import { forwardRef, type SelectHTMLAttributes, useState } from "react";
import { FormattedMessage } from "react-intl";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: React.ReactNode;
    required?: boolean;
    helperText?: string;
    options: Array<{ value: string; label: string }>;
    placeholder?: string;
    error?: string;
}

type SelectedOption = {
    value: string;
    label: string;
} | null;

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
    ({ label, required = false, helperText, options, placeholder = "Select an option", error, onChange, ...rest }, ref) => {
        const [isOpen, setIsOpen] = useState(false);
        const [selectedOption, setSelectedOption] = useState<SelectedOption | null>(null);

        const handleToggle = () => {
            setIsOpen(!isOpen);
        };

        const handleSelectOption = (value: string, label: string) => {
            setSelectedOption({ value, label });
            setIsOpen(false);

            // Trigger onChange for react-hook-form
            if (onChange) {
                const syntheticEvent = {
                    target: { value, name: rest.name },
                } as React.ChangeEvent<HTMLSelectElement>;
                onChange(syntheticEvent);
            }
        };

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
                <div>
                    <button type="button" onClick={handleToggle}>
                        <span>{selectedOption?.label || placeholder}</span>
                        <SvgUse href="/assets/icons/chevron-down.svg#root" width={16} height={16} />
                    </button>
                    {isOpen && (
                        <div>
                            {options.map((option) => (
                                <div key={option.value} onClick={() => handleSelectOption(option.value, option.label)}>
                                    {option.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* Hidden select for form integration */}
                <select ref={ref} required={required} style={{ display: "none" }} onChange={onChange} {...rest}>
                    <option value="">{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value} selected={selectedOption?.value === option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <div style={{ color: "red" }}>{error}</div>}
                {helperText && <div>{helperText}</div>}
            </div>
        );
    },
);
