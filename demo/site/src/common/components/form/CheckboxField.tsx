import { type ComponentProps, type ReactNode } from "react";
import { type Control, Controller, type FieldValues, type Path, type RegisterOptions } from "react-hook-form";

interface CheckboxFieldProps<TFieldValues extends FieldValues> extends Omit<ComponentProps<"input">, "name"> {
    name: Path<TFieldValues>;
    control: Control<TFieldValues>;
    rules?: RegisterOptions<TFieldValues>;
    label: ReactNode;
    helperText?: ReactNode;
    required?: boolean;
}

export const CheckboxField = <TFieldValues extends FieldValues>({
    name,
    control,
    rules,
    label,
    helperText,
    required = false,
    ...inputProps
}: CheckboxFieldProps<TFieldValues>) => {
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
