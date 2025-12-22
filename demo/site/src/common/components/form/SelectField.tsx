import { SvgUse } from "@src/common/helpers/SvgUse";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

interface SelectFieldProps {
    label: ReactNode;
    required?: boolean;
    helperText?: ReactNode;
    options: Array<{ value: string; label: string }>;
    placeholder?: string;
}

export function SelectField({
    label,
    required = false,
    helperText,
    options,
    placeholder = "Select an option",
}: SelectFieldProps): React.ReactElement {
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
                <button type="button">
                    <span>{placeholder}</span>
                    <SvgUse href="/assets/icons/chevron-down.svg#root" width={16} height={16} />
                </button>

                <div>
                    {options.map((option) => (
                        <div key={option.value}>{option.label}</div>
                    ))}
                </div>
            </div>
            {helperText && <div>{helperText}</div>}
        </div>
    );
}
