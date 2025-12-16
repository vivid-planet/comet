import { SvgUse } from "@src/common/helpers/SvgUse";
import { useState } from "react";

interface SelectFieldProps {
    label: React.ReactNode;
    required?: boolean;
    helperText?: string;
    options: Array<{ value: string; label: string }>;
    placeholder?: string;
}

type SelectedOption = {
    value: string;
    label: string;
} | null;

export function SelectField({
    label,
    required = false,
    helperText,
    options,
    placeholder = "Select an option",
}: SelectFieldProps): React.ReactElement {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<SelectedOption | null>(null);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleSelectOption = (value: string, label: string) => {
        setSelectedOption({ value, label });
        setIsOpen(false);
    };

    return (
        <div>
            <div>
                {label}
                {!required && <span>(optional)</span>}
            </div>
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
            {helperText && <div>{helperText}</div>}
        </div>
    );
}
