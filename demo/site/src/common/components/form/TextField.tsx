import { type ComponentProps, type ReactNode } from "react";
import { Controller, type ControllerProps, type FieldValues } from "react-hook-form";
import { FormattedMessage } from "react-intl";

type TextFieldProps<TFieldValues extends FieldValues> = {
    label: ReactNode;
    helperText?: ReactNode;
    controllerProps: Omit<ControllerProps<TFieldValues>, "render">;
    inputProps: Omit<ComponentProps<"input">, "name">;
};

export const TextField = <TFieldValues extends FieldValues>({ label, helperText, controllerProps, inputProps }: TextFieldProps<TFieldValues>) => {
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
