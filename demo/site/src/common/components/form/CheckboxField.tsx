import { SvgUse } from "@src/common/helpers/SvgUse";
import clsx from "clsx";
import { type InputHTMLAttributes, type ReactNode, useId } from "react";
import { Controller, type ControllerProps, type FieldValues } from "react-hook-form";

import styles from "./CheckboxField.module.scss";

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
    const descriptionId = useId();
    const required = !!rules?.required;

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { value, ...field }, fieldState }) => (
                <div>
                    <label htmlFor={id} className={styles.wrapper}>
                        <input
                            type="checkbox"
                            {...inputProps}
                            {...field}
                            id={id}
                            checked={Boolean(value)}
                            aria-required={required}
                            aria-invalid={fieldState.error ? true : undefined}
                            aria-describedby={fieldState.error?.message || helperText ? descriptionId : undefined}
                            className={styles.input}
                        />
                        <span
                            className={clsx(
                                styles.checkbox,
                                Boolean(value) && styles["checkbox--checked"],
                                fieldState.error && styles["checkbox--error"],
                            )}
                        />
                        <span className={styles.labelText}>{label}</span>
                    </label>
                    {(fieldState.error?.message || helperText) && (
                        <div id={descriptionId} className={styles.labelContent}>
                            {fieldState.error?.message ? (
                                <span className={styles.error}>
                                    <SvgUse href="/assets/icons/error.svg#root" width={16} height={16} />
                                    {fieldState.error.message}
                                </span>
                            ) : (
                                <span className={styles.helperText}>{helperText}</span>
                            )}
                        </div>
                    )}
                </div>
            )}
        />
    );
};
