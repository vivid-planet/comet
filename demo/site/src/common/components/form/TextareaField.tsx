import { type ReactNode, type TextareaHTMLAttributes } from "react";
import { Controller, type ControllerProps, type FieldValues } from "react-hook-form";
import { FormattedMessage } from "react-intl";

type TextareaFieldProps<TFieldValues extends FieldValues> = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> &
    Pick<ControllerProps<TFieldValues>, "name" | "control" | "rules"> & {
        label: ReactNode;
        helperText?: ReactNode;
    };

export const TextareaField = <TFieldValues extends FieldValues>({
    label,
    helperText,
    name,
    control,
    rules,
    ...inputProps
}: TextareaFieldProps<TFieldValues>) => {
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
                                <FormattedMessage id="inputField.optional" defaultMessage="(optional)" />
                            </span>
                        )}
                    </label>
                    <textarea required={required} {...inputProps} {...field} />
                    {helperText && <div>{helperText}</div>}
                    {fieldState.error?.message && <div style={{ color: "red" }}>{fieldState.error.message}</div>}
                </div>
            )}
        />
    );
};
