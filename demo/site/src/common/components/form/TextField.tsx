import { type InputHTMLAttributes, type ReactNode } from "react";
import { type Control, Controller, type FieldValues, type Path, type RegisterOptions } from "react-hook-form";
import { FormattedMessage } from "react-intl";

interface InputProps<TFieldValues extends FieldValues> extends Omit<InputHTMLAttributes<HTMLInputElement>, "name"> {
    name: Path<TFieldValues>;
    control: Control<TFieldValues>;
    rules?: RegisterOptions<TFieldValues>;
    label: ReactNode;
    required?: boolean;
    helperText?: ReactNode;
}

export const TextField = <TFieldValues extends FieldValues>({
    name,
    control,
    rules,
    label,
    required = false,
    helperText,
    ...inputProps
}: InputProps<TFieldValues>) => {
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
                                <FormattedMessage id="inputField.optional" defaultMessage="(optional)" />
                            </span>
                        )}
                    </label>
                    <input required={required} {...inputProps} {...field} />
                    {helperText && <div>{helperText}</div>}
                    {fieldState.error?.message && <div style={{ color: "red" }}>{fieldState.error.message}</div>}
                </div>
            )}
        />
    );
};
