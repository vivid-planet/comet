import { type InputHTMLAttributes, type ReactNode } from "react";
import { Controller, type ControllerProps, type FieldValues } from "react-hook-form";

type CheckboxFieldProps<TFieldValues extends FieldValues> = Omit<InputHTMLAttributes<HTMLInputElement>, "name"> &
    Pick<ControllerProps<TFieldValues>, "name" | "control" | "rules"> & {
        label: ReactNode;
        helperText?: ReactNode;
    };

export const CheckboxField = <TFieldValues extends FieldValues>({
    label,
    helperText,
    name,
    control,
    rules,
    ...inputProps
}: CheckboxFieldProps<TFieldValues>) => {
    const required = !!rules?.required;
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { value, ...field }, fieldState }) => (
                <div>
                    <input type="checkbox" required={required} {...inputProps} {...field} checked={value} />
                    <label>{label}</label>
                    {helperText && <div>{helperText}</div>}
                    {fieldState.error?.message && <div style={{ color: "red" }}>{fieldState.error.message}</div>}
                </div>
            )}
        />
    );
};
