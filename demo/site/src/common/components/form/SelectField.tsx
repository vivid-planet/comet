import { type ReactNode, type SelectHTMLAttributes } from "react";
import { type Control, Controller, type FieldValues, type Path, type RegisterOptions } from "react-hook-form";
import { FormattedMessage } from "react-intl";

interface SelectFieldProps<TFieldValues extends FieldValues> extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "name"> {
    name: Path<TFieldValues>;
    control: Control<TFieldValues>;
    rules?: RegisterOptions<TFieldValues>;
    label: ReactNode;
    required?: boolean;
    helperText?: ReactNode;
    options: Array<{ value: string; label: ReactNode }>;
    placeholder?: ReactNode;
}

export const SelectField = <TFieldValues extends FieldValues>({
    name,
    control,
    rules,
    label,
    required = false,
    helperText,
    options,
    placeholder = <FormattedMessage id="selectField.placeholder" defaultMessage="Select an option" />,
    ...selectProps
}: SelectFieldProps<TFieldValues>) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => (
                <div>
                    <label>
                        {label}
                        {!required && (
                            <span>
                                <FormattedMessage id="selectField.optional" defaultMessage="(optional)" />
                            </span>
                        )}
                    </label>
                    <select required={required} {...selectProps} {...field}>
                        <option value="" disabled>
                            {placeholder}
                        </option>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {helperText && <div>{helperText}</div>}
                    {fieldState.error?.message && <div style={{ color: "red" }}>{fieldState.error.message}</div>}
                </div>
            )}
        />
    );
};
