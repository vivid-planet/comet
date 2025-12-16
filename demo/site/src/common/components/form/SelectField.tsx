import { SvgUse } from "@src/common/helpers/SvgUse";
import { useState } from "react";

import { Typography } from "../Typography";
import styles from "./SelectField.module.scss";

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
        <div className={styles.select}>
            <label className={styles.selectWrapper}>
                <Typography as="span" variant="paragraph300" className={styles.inputLabel}>
                    {label}
                </Typography>
                {!required && (
                    <Typography as="span" variant="paragraph200" color="var(--text-secondary)">
                        (optional)
                    </Typography>
                )}
            </label>
            <div className={styles.selectWrapper}>
                <button type="button" onClick={handleToggle} className={styles.selectField}>
                    <span className={selectedOption ? styles.selectedText : styles.placeholderText}>{selectedOption?.label || placeholder}</span>
                    <SvgUse
                        href="/assets/icons/chevron-down.svg#root"
                        width={16}
                        height={16}
                        className={`${styles.chevron} ${isOpen ? styles["chevron--expanded"] : ""}`}
                    />
                </button>
                {isOpen && (
                    <div className={styles.dropdown}>
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => handleSelectOption(option.value, option.label)}
                                className={`${styles.dropdownOption} ${selectedOption?.value === option.value ? styles["dropdownOption--selected"] : ""}`}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {helperText && (
                <div className={styles.helperText}>
                    <Typography variant="paragraph200">{helperText}</Typography>
                </div>
            )}
        </div>
    );
}
