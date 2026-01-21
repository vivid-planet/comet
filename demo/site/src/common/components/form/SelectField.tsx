import { type ComponentProps, type ReactNode } from "react";
import { Controller, type ControllerProps, type FieldValues } from "react-hook-form";
import { FormattedMessage } from "react-intl";

type SelectFieldProps<TFieldValues extends FieldValues> = Omit<ComponentProps<"select">, "name"> &
    Omit<ControllerProps<TFieldValues>, "render"> & {
        label: ReactNode;
        helperText?: ReactNode;
        options: Array<{ value: string; label: ReactNode }>;
        placeholder?: ReactNode;
    };

export const SelectField = <TFieldValues extends FieldValues>({
    name,
    control,
    rules,
    label,
    helperText,
    options,
    placeholder = <FormattedMessage id="selectField.placeholder" defaultMessage="Select an option" />,
    ...selectProps
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
