import { type ReactNode, type TextareaHTMLAttributes } from "react";
import { type Control, Controller, type FieldValues, type Path, type RegisterOptions } from "react-hook-form";
import { FormattedMessage } from "react-intl";

interface InputProps<TFieldValues extends FieldValues> extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> {
    name: Path<TFieldValues>;
    control: Control<TFieldValues>;
    rules?: RegisterOptions<TFieldValues>;
    label: ReactNode;
    required?: boolean;
    placeholder?: string;
    helperText?: ReactNode;
}

export const TextareaField = <TFieldValues extends FieldValues>({
    name,
    control,
    rules,
    label,
    required = false,
    placeholder,
    helperText,
    ...textareaProps
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
                    <textarea placeholder={placeholder} {...textareaProps} {...field} />
                    {helperText && <div>{helperText}</div>}
                    {fieldState.error?.message && <div style={{ color: "red" }}>{fieldState.error.message}</div>}
                </div>
            )}
        />
    );
};
