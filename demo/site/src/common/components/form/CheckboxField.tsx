import { type ComponentProps, type ReactNode } from "react";
import { Controller, type ControllerProps, type FieldValues } from "react-hook-form";

type CheckboxFieldProps<TFieldValues extends FieldValues> = Omit<ComponentProps<"input">, "name"> &
    Omit<ControllerProps<TFieldValues>, "render"> & {
        label: ReactNode;
        helperText?: ReactNode;
    };

export const CheckboxField = <TFieldValues extends FieldValues>({
    label,
    helperText,
    name,
    control,
    rules,
    defaultValue,
    shouldUnregister,
    disabled,
    ...inputProps
}: CheckboxFieldProps<TFieldValues>) => {
    const required = !!rules?.required;
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            defaultValue={defaultValue}
            shouldUnregister={shouldUnregister}
            disabled={disabled}
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
