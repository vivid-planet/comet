import { type TextareaHTMLAttributes } from "react";
import { Controller, type ControllerProps, type FieldValues } from "react-hook-form";

import { Typography } from "../Typography";
import { FieldContainer, type FieldContainerFieldProps } from "./FieldContainer";

type TextareaFieldProps<TFieldValues extends FieldValues> = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> &
    Pick<ControllerProps<TFieldValues>, "name" | "control" | "rules"> &
    FieldContainerFieldProps;

export const TextareaField = <TFieldValues extends FieldValues>({
    helperText,
    name,
    control,
    rules,
    label,
    ...inputProps
}: TextareaFieldProps<TFieldValues>) => {
    const required = !!rules?.required;
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => (
                <FieldContainer required={required} label={label} helperText={helperText} errorText={fieldState.error?.message}>
                    <Typography as="textarea" variant="paragraph200" {...inputProps} {...field} />
                </FieldContainer>
            )}
        />
    );
};
