import clsx from "clsx";
import { type InputHTMLAttributes, type ReactNode, useId } from "react";
import { Controller, type ControllerProps, type FieldValues } from "react-hook-form";

import styles from "./CheckboxField.module.scss";
import { FieldContainer } from "./FieldContainer";

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
    const id = useId();
    const required = !!rules?.required;

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { value, ...field }, fieldState }) => (
                <FieldContainer helperText={helperText} errorText={fieldState.error?.message}>
                    <label htmlFor={id} className={styles.wrapper}>
                        <input type="checkbox" id={id} {...inputProps} {...field} required={required} checked={value} className={styles.input} />
                        <span className={clsx(styles.checkbox, fieldState.error && styles["checkbox--error"])} />
                        <span className={styles.labelText}>{label}</span>
                    </label>
                </FieldContainer>
            )}
        />
    );
};
