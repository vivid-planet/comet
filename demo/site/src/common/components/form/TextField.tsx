import { type ComponentProps, type ReactNode } from "react";
import { Controller, type ControllerProps, type FieldValues } from "react-hook-form";
import { FormattedMessage } from "react-intl";

type InputProps<TFieldValues extends FieldValues> = Omit<ComponentProps<"input">, "name"> &
    Omit<ControllerProps<TFieldValues>, "render"> & {
        label: ReactNode;
        helperText?: ReactNode;
    };

export const TextField = <TFieldValues extends FieldValues>({ name, control, rules, label, helperText, ...inputProps }: InputProps<TFieldValues>) => {
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
                    <input required={required} {...inputProps} {...field} />
                    {helperText && <div>{helperText}</div>}
                    {fieldState.error?.message && <div style={{ color: "red" }}>{fieldState.error.message}</div>}
                </div>
            )}
        />
    );
};
