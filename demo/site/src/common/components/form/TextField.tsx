import { SvgUse } from "@src/common/helpers/SvgUse";
import { type InputHTMLAttributes, type ReactNode } from "react";
import { Controller, type ControllerProps, type FieldValues } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { Typography } from "../Typography";
import styles from "./TextField.module.scss";

type TextFieldProps<TFieldValues extends FieldValues> = Omit<InputHTMLAttributes<HTMLInputElement>, "name"> &
    Pick<ControllerProps<TFieldValues>, "name" | "control" | "rules"> & {
        label: ReactNode;
        helperText?: ReactNode;
    };

export const TextField = <TFieldValues extends FieldValues>({
    label,
    helperText,
    name,
    control,
    rules,
    ...inputProps
}: TextFieldProps<TFieldValues>) => {
    const required = !!rules?.required;

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => (
                <div>
                    <div className={styles.labelWrapper}>
                        <label className={styles.label}>{label}</label>
                        {!required && (
                            <span className={styles.optionalText}>
                                <FormattedMessage id="inputField.optional" defaultMessage="optional" />
                            </span>
                        )}
                    </div>
                    <Typography as="input" variant="paragraph200" {...inputProps} {...field} className={styles.inputField} />
                    {helperText && (
                        <Typography variant="paragraph200" className={styles.helperText}>
                            {helperText}
                        </Typography>
                    )}
                    {fieldState.error?.message && (
                        <div className={styles.errorWrapper}>
                            <SvgUse href="/assets/icons/error.svg#root" width={16} height={16} />
                            <Typography variant="paragraph200">{fieldState.error.message}</Typography>
                        </div>
                    )}
                </div>
            )}
        />
    );
};
