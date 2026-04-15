import { SvgUse } from "@src/common/helpers/SvgUse";
import clsx from "clsx";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import styles from "./FieldContainer.module.scss";

type FieldContainerProps = {
    label?: ReactNode;
    required?: boolean;
    errorText?: ReactNode;
    helperText?: ReactNode;
    children: ReactNode;
    htmlFor?: string;
    descriptionId?: string;
    descriptionClassName?: string;
};

export type FieldContainerFieldProps = Pick<FieldContainerProps, "label" | "helperText">;

export const FieldContainer: React.FC<FieldContainerProps> = ({
    label,
    required,
    errorText,
    helperText,
    children,
    htmlFor,
    descriptionId,
    descriptionClassName,
}) => {
    return (
        <div>
            {label && (
                <div className={styles.labelWrapper}>
                    <label className={styles.label} htmlFor={htmlFor}>
                        {label}
                    </label>
                    {!required && (
                        <span className={styles.optionalText}>
                            <FormattedMessage id="fieldContainer.optional" defaultMessage="(optional)" />
                        </span>
                    )}
                </div>
            )}
            {children}
            {errorText ? (
                <div id={descriptionId} className={clsx(styles.errorWrapper, descriptionClassName)}>
                    <SvgUse href="/assets/icons/error.svg#root" width={16} height={16} />
                    {errorText}
                </div>
            ) : helperText ? (
                <div id={descriptionId} className={clsx(styles.helperText, descriptionClassName)}>
                    {helperText}
                </div>
            ) : null}
        </div>
    );
};
