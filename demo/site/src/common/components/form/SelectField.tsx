import { type ComponentProps, type ReactNode } from "react";
import { Controller, type ControllerProps, type FieldValues } from "react-hook-form";
import { FormattedMessage } from "react-intl";

type SelectFieldProps<TFieldValues extends FieldValues> = {
    label: ReactNode;
    helperText?: ReactNode;
    controllerProps: Omit<ControllerProps<TFieldValues>, "render">;
    inputProps: Omit<ComponentProps<"select">, "name">;
    options: Array<{ value: string; label: ReactNode }>;
    placeholder?: ReactNode;
};

export const SelectField = <TFieldValues extends FieldValues>({
    label,
    helperText,
    controllerProps,
    inputProps,
    options,
    placeholder = <FormattedMessage id="selectField.placeholder" defaultMessage="Select an option" />,
}: SelectFieldProps<TFieldValues>) => {
    const required = !!controllerProps.rules?.required;
    return (
        <Controller
            {...controllerProps}
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
