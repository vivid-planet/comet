import { type InputHTMLAttributes } from "react";
import { Controller, type ControllerProps, type FieldValues } from "react-hook-form";

import { Typography } from "../Typography";
import { FieldContainer, type FieldContainerFieldProps } from "./FieldContainer";

type TextFieldProps<TFieldValues extends FieldValues> = Omit<InputHTMLAttributes<HTMLInputElement>, "name"> &
    Pick<ControllerProps<TFieldValues>, "name" | "control" | "rules"> &
    FieldContainerFieldProps;

export const TextField = <TFieldValues extends FieldValues>({
    helperText,
    name,
    control,
    rules,
    label,
    ...inputProps
}: TextFieldProps<TFieldValues>) => {
    const required = !!rules?.required;

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => (
                <FieldContainer required={required} label={label} helperText={helperText} errorText={fieldState.error?.message} htmlFor={name}>
                    <Typography as="input" variant="paragraph200" {...inputProps} {...field} id={name} />
                </FieldContainer>
            )}
        />
    );
};
