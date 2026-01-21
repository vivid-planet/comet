import { type ComponentProps, type ReactNode } from "react";
import { Controller, type ControllerProps, type FieldValues } from "react-hook-form";

type CheckboxFieldProps<TFieldValues extends FieldValues> = {
    label: ReactNode;
    helperText?: ReactNode;
    controllerProps: Omit<ControllerProps<TFieldValues>, "render">;
    inputProps: Omit<ComponentProps<"input">, "name">;
};

export const CheckboxField = <TFieldValues extends FieldValues>({
    label,
    helperText,
    controllerProps,
    inputProps,
}: CheckboxFieldProps<TFieldValues>) => {
    const required = !!controllerProps.rules?.required;
    return (
        <Controller
            {...controllerProps}
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
