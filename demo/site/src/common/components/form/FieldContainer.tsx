import { SvgUse } from "@src/common/helpers/SvgUse";
import { type ReactNode } from "react";

import styles from "./FieldContainer.module.scss";

type FieldContainerProps = {
    label?: ReactNode;
    required?: boolean;
    errorText?: ReactNode;
    helperText?: ReactNode;
    children: ReactNode;
    htmlFor?: string;
};

export type FieldContainerFieldProps = Pick<FieldContainerProps, "label" | "helperText">;

export const FieldContainer: React.FC<FieldContainerProps> = ({ label, required, errorText, helperText, children, htmlFor }) => {
    return (
        <div>
            {label && (
                <div className={styles.labelWrapper}>
                    <label className={styles.label} htmlFor={htmlFor}>
                        {label}
                    </label>
                    {!required && <span className={styles.optionalText}>(optional)</span>}
                </div>
            )}
            <div className={clsx({styles.fieldBase, errorText ? styles.fieldBaseError : "")}>{children}</div>
            {errorText ? (
                <div className={styles.errorWrapper}>
                    <SvgUse href="/assets/icons/error.svg#root" width={16} height={16} />
                    {errorText}
                </div>
            ) : (
                helperText && <div className={styles.helperText}>{helperText}</div>
            )}
        </div>
    );
};
