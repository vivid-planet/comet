import { type ReactNode, type SelectHTMLAttributes } from "react";
import { Controller, type ControllerProps, type FieldValues } from "react-hook-form";
import { FormattedMessage } from "react-intl";

type SelectFieldProps<TFieldValues extends FieldValues> = Omit<SelectHTMLAttributes<HTMLSelectElement>, "name"> &
    Pick<ControllerProps<TFieldValues>, "name" | "control" | "rules"> & {
        label: ReactNode;
        helperText?: ReactNode;
        options: Array<{ value: string; label: ReactNode }>;
        placeholder?: ReactNode;
    };

export const SelectField = <TFieldValues extends FieldValues>({
    label,
    helperText,
    name,
    control,
    rules,
    options,
    placeholder = <FormattedMessage id="selectField.placeholder" defaultMessage="Select an option" />,
    ...inputProps
}: SelectFieldProps<TFieldValues>) => {
    const required = !!rules?.required;
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
                    <select required={required} {...inputProps} {...field}>
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
